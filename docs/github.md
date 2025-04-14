# GitHub instructions

This is the GitHub instructions for general purposes.

> [!NOTE]
> If you prefer the video format, please watch these videos below instead.
>
> [![](https://i.ytimg.com/vi/z5jZ9lrSpqk/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBBktaEWnKx2KfkK2gGiW85wiS1Mw)](https://www.youtube.com/watch?v=z5jZ9lrSpqk)
>
> [![](https://i.ytimg.com/vi/Dedz4gRHezg/hq720.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCkm9e5sgIGuZVgm8ZITVywdkgl5Q)](https://www.youtube.com/watch?v=Dedz4gRHezg)

## Structure

- [A. How to clone or pull from GitHub](#a-how-to-clone-or-pull-from-github)
- [B. How to checkout the branch](#b-how-to-checkout-the-branch)
- [C. How to create a new branch](#c-how-to-create-a-new-branch)
- [D. If you are in your branch, you need to merge from 'develop' for the lastest content](#d-if-you-are-in-your-branch-you-need-to-merge-from-develop-for-the-lastest-content)
- [E. You had updated something in local, and need to push to GitHub](#e-you-had-updated-something-in-local-and-need-to-push-to-github)
- [F. You had completed your code in branch, and want to merge](#f-you-had-completed-your-code-in-branch-and-want-to-merge)
- [G. Additioanl information](#g-additional-information)

### <span style="color:cyan">A. How to clone or pull from GitHub:</span>

#### Clone the repository:

```bash
git clone https://github.cs.adelaide.edu.au/INFLUXUI-ATYSYS/InfluxUI-PG02.git
```

#### Pull from the branch, if there are updates

```bash
git pull origin <branch-name>
```

[Back to Top](#github-instructions)

### <span style="color:cyan">B. How to checkout the branch:</span>

#### Checkout the local branch (on your local machine)

```bash
git branch
```

#### Checkout the remote branch (on GitHub)

```bash
git branch -r
```

#### Checkout the remote branch and local branch

```bash
git branch -a
q # to quit(leave)
```

[Back to Top](#github-instructions)

### <span style="color:cyan">C. How to create a new branch:</span>

#### Create a new branch for your local development

```bash
git checkout -b feat/<ticket-number>-<feature-name>
# or
git checkout -b fix/<ticket-number>-<fix-name>
```

#### Switching to the branch

```bash
git checkout <branch-name>
```

#### Switching back to the 'develop' branch

```bash
git checkout develop
```

[Back to Top](#github-instructions)

### <span style="color:cyan">D. If you are in your branch, you need to merge from 'develop' for the lastest content:

Step-by-step:

1. check you are in your branch, ex:

   ```bash
   git checkout feat/8-retrieve-measurements
   ```

2. pull and merge the updated content in our main branch -> 'develop'

   ```bash
   git fetch origin
   ```

3. merge the content to your branch:

   ```bash
   git merge origin/develop
   ```

[Back to Top](#github-instructions)

### <span style="color:cyan">E. You had updated something in local, and need to push to GitHub:</span>

Step-by-step:

1. In VScode, open the terminal
2. Check the status the branch
   for example: in 'develop' branch <span style='color:red'>but please do not develop in 'develop' branch!</span>

   ```bash
   git checkout develop
   git status
   ```

3. Add all files you want to commit to GitHub:

   ```bash
   git add .
   ```

   Or add specific file by specific file name, ex:

   ```bash
   git add docs/github.md
   ```

4. Commit the changes to the local repository:

   ```bash
   git commit -m "type your commit message here"
   ```

5. Push the changes to the remote repository:

   ```bash
   git push origin develop
   ```

6. To GitGub project's page, refresh the page, and check the changes.

[Back to Top](#github-instructions)

### <span style="color:cyan">F. You had completed your code in branch, and want to merge:</span>

1. check the status of the branch:

   ```bash
   git status
   ```

2. check the branch you are in:

   ```bash
   git branch
   ```

3. switch to the your branch you want to merge, for example: to branch: feat/14-dnd-nodes

   ```bash
   git checkout feat/14-dnd.nodes
   git status
   ```

4. commit the changes to the local repository:

   ```bash
   git add .
   git commit -m "type your commit message here"
   ```

5. checkout to the branch you want to merge in, for example, to branch: feat/14-xyflowreact-drag-and-drop

   ```bash
   git checkout feat/14-xyflowreact-drag-and-drop
   ```

6. merge the branch you want to merge in

   ```bash
   git merge feat/14-dnd-nodes
   ```

7. push the changes to the GitHub remote repository:

   ```bash
   git push origin feat/14-xyflowreact-drag-and-drop
   ```

8. refresh the GitHub project page, and check the changes.

[Back to Top](#github-instructions)

### <span style="color:cyan">G. Additional information:</span>

If you are in a initial stage of any project, the basic git steps from your local ternimal(in VScode) to GitHub are as follows:<br>

Step-by-step:

1. open VScode terminal
2. cd to your project repository
3. initial your local git repository

   ```bash
   git init
   ```

4. add all files in the repository in local git repository cache space

   ```bash
   git add .
   ```

5. authorization username and email

   ```bash
   git config user.name "XXXXX"
   git config user.email "XXXX@XXXXX"
   ```

6. commit files to local git repository

   ```bash
   git commit -m "Initial commit"
   ```

7. to your GitHub project page

   1. create a new repository. For example, the repository name is 'todolist'
   2. to 'Settings' - 'General' - scroll down - 'Danger Zone' - set repository to 'private' ('public' is for public access, anyone can access the repository.)
   3. copy the repository URL from 'Code' button, for example: https://github.com/linhan0112/todolist.git

8. connect your local git cache and your remote GitHub repository

   ```bash
   git remote add origin https://github.com/linhan0112/todolist.git
   ```

9. push local change to GitHub repository

   be aware of the branch you are in: ex, in 'Main' branch:

   ```bash
   git branch -M main
   git push -u origin main
   ```

10. check status

    ```bash
    git branch
    git status
    ```

[Back to Top](#github-instructions)
