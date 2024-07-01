
from django.conf import settings
import base64
from cryptography.fernet import Fernet


def get_encryptor_with_key() -> Fernet:
    key_bytes = settings.ENCRYPTION_KEY.encode()
    fernet = Fernet(base64.b64encode(key_bytes))
    return fernet


def encrypt_string(value: str) -> str:
    fernet = get_encryptor_with_key()
    return fernet.encrypt(value.encode()).decode("utf-8")


def decrypt_string(value: str) -> str:
    fernet = get_encryptor_with_key()
    return fernet.decrypt(value.encode()).decode("utf-8")
