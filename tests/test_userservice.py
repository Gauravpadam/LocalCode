import pytest
import json
import sys
from os import path
sys.path.append( path.dirname( path.dirname( path.abspath(__file__) ) ) )
from src.repository.dataclass import User as UserEntity
from src.DTO.Users import Credentials
from src.service.UserService import UserService
from src.repository.UserRepository import UserRepository
import bcrypt
# from mockito import unstub, when, mock 

@pytest.fixture
def example_credentials():

    return list(map(
        json.dumps, [
            {
                "username": "architect",
                "email": "architect@localcode.com",
                "password": "architect",
            },
            {
                "username": "gaurav",
                "email": "gaurav@localcode.com",
                "password": "gpzzz",
            },
            {
                "username": "",
                "email": "@localcode.com",
                "password": "",
            },
        ]
    ))

# def test_cred_parsing(example_credentials):

#     repo = UserRepository()

    # when(repo.register_user)

# TODO: Redo this test

# def test_register_user(example_credentials):

#     service = UserService()
#     when(service).checkIfUserExists(...).thenReturn(False)
#     when(service.repository).register_user(...).thenReturn("User Created Successfully")

#     for user in example_credentials:
#         user = Credentials(**json.loads(user))
#         assert service.checkIfUserExists(user.username) == False
#         salt = bcrypt.gensalt()
#         hashed_password = service.hash_password(user.password.encode('utf8'), salt)
#         assert hashed_password == bcrypt.hashpw(user.password.encode('utf8'), salt)
#         assert service.repository.register_user(user) == "User Created Successfully"
    
#     unstub()

def test_hashing(example_credentials):

    users = [Credentials(**json.loads(user)) for user in example_credentials]
    service = UserService()

    for user in users:
        salt = bcrypt.gensalt()
        assert service.hash_password(user.password.encode('utf-8'), salt) == bcrypt.hashpw(user.password.encode('utf8'), salt)



    

# def test_authenticate_user(example_credentials):

#     service = UserService()
#     when(service).








    
