import hashlib

def ListToHex(intList, spaces = True):
    if spaces:
        sep = ' '
    else:
        sep = ''

    #return [hex(num) for num in intList]
    return sep.join(format(num, '02x') for num in intList)

def XorLists(list1, list2):
    if len(list1) != len(list2):
        print(f'Length mismatch ({len(list1)} vs {len(list2)})')
        assert(False)
    return [list1[i] ^ list2[i] for i in range(len(list1))]

def PrintNamedString(name, myString):
    print(f'{name}:')
    print(f'\t{myString}')

def PrintHexList(name, byteList):
    print(f'{name} ({len(byteList)}):')
    print(f'\t{ListToHex(byteList, True)}')

def ToByteArr(val):
    if isinstance(val,str):
        return list(val.encode('utf-8'))
    return val

def XorPasswords(raw_pwd, hashed_pwd, debug = False):

    #raw_pwd_bytes = list(raw_pwd.encode('utf-8'))
    raw_pwd_bytes = ToByteArr(raw_pwd)
    #hashed_pwd_bytes = list(hashed_pwd.encode('utf-8'))
    hashed_pwd_bytes = ToByteArr(hashed_pwd)

    pwd_hash = list(hashlib.sha256(hashed_pwd.encode('utf-8')).digest())
    padded_raw_pwd_bytes = raw_pwd_bytes + [0]*(len(pwd_hash) - len(raw_pwd_bytes))

    if debug:
        PrintHexList('Raw password bytes', raw_pwd_bytes)
        PrintHexList('Hashed password bytes', hashed_pwd_bytes)
        PrintHexList('Password hash', pwd_hash)
        PrintHexList('Padded raw password', padded_raw_pwd_bytes)

    xor_result = XorLists(pwd_hash, padded_raw_pwd_bytes)

    return xor_result

def GenerateStoredKey(database_password, user_password, debug = False):
    keyBytes = XorPasswords(database_password, user_password, debug)
    return ListToHex(keyBytes, False)

def GetDatabasePassword(stored_key, user_password, debug = False):

    # Convert the stored key (e.g. '4142') to a list of bytes
    #storedBytes = list(bytes.fromhex(stored_key))
    #storedBytes = stored_key
    storedBytes = [int(stored_key[i:i+2], 16) for i in range(0, len(stored_key), 2)]

    if debug: PrintHexList('Stored Bytes', storedBytes)

    reversed_pwd = XorPasswords(storedBytes, user_password, debug)
    reversed_pwd = [chr(num) for num in reversed_pwd if num != 0]
    return ''.join(reversed_pwd)

if __name__ == '__main__':

    database_password = "databasePassword"
    user_password = "userPassword"

    PrintNamedString('Database password', database_password)

    print('------------------------------------------------')
    stored_key = GenerateStoredKey(database_password, user_password, False)
    PrintNamedString('Stored key', stored_key)

    print('------------------------------------------------')
    reversed_pwd = GetDatabasePassword(stored_key, user_password, False)
    PrintNamedString('Reversed password string', reversed_pwd)

    assert(database_password == reversed_pwd)

    print('Yay')
