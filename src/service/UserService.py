from src.DTO.Users import Credentials
from src.repository.dataclass import User as UserEntity
from src.repository.UserRepository import UserRepository
import bcrypt

class UserService():

    repository = UserRepository()

    async def register_user(self, username, email, password):
        if self.checkIfUserExists(username):
            return False
    
        salt = bcrypt.gensalt()
        hashed_password = self.hash_password(password.encode('utf-8'), salt)
        user = UserEntity(username, hashed_password, salt)
        await self.repository.register_user(user)
        return "User created successfully"

    async def authenticate_user(self, credentials: Credentials):
        username: str = credentials.username
        if not self.checkIfUserExists(username):
                return "User not found"
        
        user_details: UserEntity = await self.repository.fetch_user_details(username)

        hashed_pw = self.hash_password(credentials.password.encode("utf-8"), user_details.salt)
        print(hashed_pw == user_details.hashed_password)
        
        if hashed_pw == user_details.hashed_password:
            return True
        
        return False


    def checkIfUserExists(self, username):
        exists = self.repository.username_fetch(username)
        return exists

    def hash_password(self, password, salt):
        return bcrypt.hashpw(password, salt)