import os

def make_dir_if_not_exist(dirpath: str):
    if not os.path.exists(dirpath):
        os.makedirs(dirpath)
        print(f"'{dirpath}' directory has been created")
    else:
        print(f"'{dirpath}' directory already exists")

def divide_chunks(l, n):
    # looping till length l
    for i in range(0, len(l), n):
        yield l[i:i + n]