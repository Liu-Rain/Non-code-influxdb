# Guide line

## Sructure:

1. [Updated on 01/09/2024 Monday workshop: using Token](#updated-on-01092024-monday-workshop-using-token) <br>
2. [Updated on 10/09/2024 Monday workshop: using Cookie](#updated-on-10092024-monday-workshop-using-cookie)

## <span style="color:gray">Updated on 01/09/2024 Monday workshop: using Token</span>

### <span style="color:cyan">Postman testing:</span>

#### Setup

- Step 1: In your terminal, cd to our project. Than, run up_compose.sh to navigate to InfluxDB server
  ```bash
  sh cli/up_compose.sh
  ```
- Step 2: Setup environment variables in influxdb terminal.  
   To your dockerdesktop(is running) -> influxdb-dev-2.7 -> Exec
  ```bash
  export ORG="ATSYS"
  export USERNAME="dev1"
  ```
- Step 3: Create the operator token
  ```bash
  influx auth create \
      --org ${ORG}  \
      --operator
  ```
  It will generate an admin operator 'Token'

#### To your Postman Desktop -> InfluxDB server

##### 'Signup'

- step 1: In 'Header', replace <span style="color:red">${OPERATOR_TOKEN}</span> with the operator Token you just created
  ```
  Authorization: Token ${OPERATOR_TOKEN}
  Content-Type: application/json
  ```
- step 2: In 'Body', make sure to select 'Raw'. Then, replace <span style="color:red">${USERNAME}</span> with the username, ex: <span style="color:red">dev1</span>
  ```
  {
      "name": ${USERNAME},
      "status": "active"
  }
  ```
- Step 3: Click 'Send' to generate. You will see the Body Output:
  ```
  {
      "links": {
          "self": "/api/v2/users/0d95cbb545ada000"
      },
      "id": "0d95cbb545ada000",
      "name": "dev1",
      "status": "active"
  }
  ```
- Step 4: If you see 'Conflict' error, it means you have already created the user. You can change the username for example: <span style="color:red">dev2</span>

- Step 5: Generate the 'authorisation token' (For the access permission authorisation for a user).<br>
  To your dockerdesktop -> influxdb-dev-2.7 -> Exec
  ```bash
  influx auth create       \
    --org ${ORG}         \
    --user ${USERNAME}    \
    --read-authorizations  \
    --write-authorizations \
    --read-buckets         \
    --write-buckets        \
    --read-dashboards      \
    --write-dashboards     \
    --read-tasks           \
    --write-tasks          \
    --read-telegrafs       \
    --write-telegrafs      \
    --read-users           \
    --write-users
  ```
  It will generate an 'authorisation Token'

##### 'Authorize'

- To Header<br>
  - To postman, in influxDB -> GET Authorize -> Header, replace <span style="color:red">${AUTHORISATION_TOKEN}</span> with the 'authorisation Token' you just created
  ```
  Authorization: Token ${AUTHORISATION_TOKEN}
  Content-Type: application/json
  ```
- To Body<br>

  ```
  {
      "description": "read buckets",
      "orgID": "ebc122dc7647a098",
      "userID": "0d95cbb545ada000",
      "status": "active",
      "permissions": [
      {
          "action": "read",
          "resource": {
          "type": "buckets"
          }
      }
      ]
  }
  ```

  - To dockerdesktop -> influxdb-dev-2.7 -> Exec

  ```bash
  influx org ls
  ```

  - copy the value of orgID
  - back to postman, in influxDB -> GET Authorize -> Body, replace the <span style="color:red">value</span> of orgID
  - to POST Signup -> Body -> copy the value of userID
  - to GET Authorize -> Body, replace the <span style="color:red">value</span> of userID

  - click 'Send' to see the output

##### 'Create password'

- Header
  - replace <span style="color:red">${AUTHORISATION_TOKEN}</span> with the 'authorisation Token' you just created
  ```
  Authorization: Token ${AUTHORISATION_TOKEN}
  Content-Type: application/json
  ```
  - Body
  ```
  {
  "password": "developer@123influx"
  }
  ```
  - POST address: https://localhost:8086/api/v2/users/0d95cbb545ada000/password, replace <span style="color:red">0d95cbb545ada000</span> with the userID
  - click 'Send' to see the Output with message '204 No Content' means successfully processed the request, but is not returning any content:
  ```
  204 No Content
  ```

##### Login

- login with username and password in to influxDB
  ```
  For example:
  Username dev2
  Password developer@123influx
  ```
  - Output
  ```
  204 No Content
  ```

##### InfluxDB server vitualize:

- In dockerdesktop -> influxdb-dev-2.7 -> click 8086:8086 to open the InfluxDB server(http://localhost:8086/signin)
- login with username and password in to influxDB:
  ```
  For example:
  Username dev2
  Password developer@123influx
  ```
- If you see the return message <span style="color:gray">'You don't belong to any organization. Add a user to an organization to continue'</span>, you have to add the user(dev2) to the organization.
- In dockerdesktop -> influxdb-dev-2.7 -> Exec
  ```bash
  influx user list
  ```
  You will see the users list belong to the organization.
- Add a user to the organization:
  ```bash
  influx org mamber add -n "ATSYS" -m userID # copy the userID from the list
  ```

#### Now you can test the API in Postman

##### Login

- Body
  ```
      username: ${USERNAME} #for example: dev2
      password: ${PASSWORD} #for example: developer@123influx
  ```
- click 'Send'to see the output:
  ```
  {
      "message": "Sign-in successful",
      "cookie": ${COOKIE_VALUE} # this cookie uis used for the frontend
  }
  ```
  It meanss you have successfully login to the influxDB.

[Back to Top](#guide-line)

## <span style="color:gray">Updated on 10/09/2024 Monday workshop: using Cookie</span>

### <span style="color:cyan">General concept:</span>

- When you/user login our application, server side (influxDB in our project) will generate a **cookie** as a **Token** to the user for **Authorisation**.
  - ex: You login to Facebook, Facebook backend server will generate a cookie to you for accessing the services since the cookie expires.
- When you/user logout our application, server side will remove the cookie.
- When you/user access our application, server side will check the cookie.
- If the cookie is valid, server side will allow you/user to access our application.
  - You don't have to login with username and password again.
- If the cookie is invalid, server side will redirect you/user to login page.

### <span style="color:cyan">Postman API tasting(with **cookie**):</span>

#### Prepare your testing environment and generate cookie:

- Run **Docker** to run influxDB server. In your terminal, cd to our project:
  ```bash
  sh cli/up_compose.sh
  ```
- Run **Postman**:

  - Testing <u>InfluxDB server</u> - <u>Login</u>:

    - step 1: InfluxDB server -> <span style="color:yellow">POST</span> Login -> <span style="background-color:blue; padding:2px;">Send</span>
    - step 2: You will see the result <span style="background-color:green; padding:2px;">204 No Content</span> for successfully access the influxDB.
    - step 3:In <u>Headers</u>, you will see the <u>Value</u> in the <u>Key</u> of <u>Set-Cookie</u>. This is the cookie with information including the cookie name, path, expires date and protocol <u>HttpOnly</u> for security.

    - step 4: Copy the cookie value.
      - Then we can use this cookie to access the influxDB server. ex, <span style="color:#00dd00">GET</span> Retrieve buckets.

  - Testing <u>InfluxDB server</u> - <u><span style="color:#00dd00">GET</span> Retrieve buckets</u>:

    - step 1: InfluxDB server -> <span style="color:#00dd00">GET</span> Retrieve buckets -> click '<span style="color:cyan">cookies</span>'.
    - step 2: type the domain name 'localhost' -> paste the cookies -> <span style="background-color:orange; padding:2px;">Save</span>.
      - Now we can use the **Cookie** instead of **Token** for authorisation.
    - step 3: <span style="background-color:blue; padding:2px;">Send</span> -> you will see the output.

  - Testing our application, to <u>Accounts app</u>:<br>

    - In <span style="color:yellow">POST</span> Login -> click <span style="background-color:blue; padding:2px;">Send</span>.
    - check 1: result

      ```bash
      {
        "message": "Sign-in successful".
      }
      ```

    - check 2: response code: <span style="background-color:green; padding:2px;">200 OK</span>.
    - check 3: In the Headers with the same **cookie value** in Set-cookie.

  - Testing <u>InfluxDB app</u> - <u><span style="color:#00dd00">GET</span> Retrieve buckets</u>:<br>

    - If we don't have the **cookie** -> click <span style="background-color:blue; padding:2px;">Send</span> ->  
       The response code is <span style="background-color:red; padding:2px;">401 Unauthorized</span>.<br>
      The output will be **unauthorized** like:

      ```bash
      {
      "error": "External API returned an error",
      "status_code": 401,
      "response": "{\"code\":\"unauthorized\",\"message\":\"unauthorized access\"}"
      }
      ```

    - In **Headers** -> in key type '**Cookie**' -> paste the cookie to it's Value-> <span style="background-color:blue; padding:2px;">Send</span> -> <br>
      The repsonse code is <span style="background-color:green; padding:2px;">200 OK</span>.<br>
      The output will be like:

      ```bash
      {
        "buckets": [
        "home",
        "becket1",
        "_tasks",
        "_monitoring"
        ]
      }
      ```

    [Back to Top](#guide-line)
