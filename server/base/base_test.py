import unittest
from rest_framework.test import APIClient


class BaseTest(unittest.TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
