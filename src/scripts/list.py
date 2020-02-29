#!/usr/bin/env python3
import os
import json

def listdirs(path):
    contents = {}
    
    if os.path.isdir(path):
        contents['id'] = os.path.basename(path)
        contents['list'] = []
        for dirent in os.listdir(path):
            contents['list'].append(listdirs(path+'/'+dirent))
        contents['list'].sort(key=lambda e: ('1' if 'list' in e else '2') + e['id'].lower())
    else:
        contents['id'] = os.path.basename(path).rsplit('.', 1)[0]
    
    return contents

print(json.dumps(listdirs('.'), separators=(',',':')))
