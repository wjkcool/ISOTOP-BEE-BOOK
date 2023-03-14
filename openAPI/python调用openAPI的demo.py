
from rich.console import Console
from pprint import pprint
from datetime import datetime
import hashlib
import requests
import sys

from rich import print
from rich import pretty
pretty.install()
console = Console(style="white on black", stderr=True)

apiKey = "7956ca03fe44238ef1d254799de1b556"
apiSecret = "bd09139024cdd3136a4f6cf60038c1194e6641063e413c47f517a579fbb158ba"
# contract_add="cfxtest:acdeym6gccnx752abhpupmmtar5e635uu6xcv2cfgy"
# contract_add='0x05271BB6F2387fbFf5cacdDBCBD5a7C1021A4b11'
# contract_add=='cfxtest:acdk44u31uwr42hy4h6ux03r5kw4ffx9ausk8k53kg'
# contract_add = 'cfx:acak9mwwemm4tgvs7j798je832mrptyrpa9d6ea78s'
contract_add = 'cfx:accm4vkvec1y96jajw0gw6k6k39gbm5bha9b8knzt5'
# chain_id='5555' # BSN wuhan
chain_id = '1029'  # Conflux


def makeHeader(body):
    sortArgs = {}
    header = {}
    hash = hashlib.md5()

    # 当前日期和时间
    now = datetime.timestamp(datetime.now())
    header['timestamp'] = str(int(now))
    header['nonce'] = str(int(now*1000000))
    header['apiKey'] = apiKey

    sortArgs.update(header)
    sortArgs.update(body)
    # print(f"{args=}")

    content = ''
    for item in sorted(sortArgs):
        content += item+sortArgs[item]

    content += apiSecret
    # print(content)

    hash.update(content.encode(encoding='utf-8'))

    # print(hash.hexdigest())

    # print(response.json())

    header["content-type"] = "application/x-www-form-urlencoded"
    header['sign'] = hash.hexdigest()

    # print(header)
    # print(body)
    # print(hash.hexdigest())
    # print(header)
    # console.print(Panel(header))
    return header


def importAccount(private_key):
    body = {}
    body['chainid'] = chain_id
    body['privateKey'] = private_key
    body['id'] = '13911024683'

    api_url = "http://35.175.145.216:8087/api/v1/chain/importAddress"

    header = makeHeader(body)
    response = requests.post(api_url, params=body, headers=header)

    json = response.json()
    if json['success'] == True:
        return json['data']
    else:
        print(json)


def exportAccount(address):
    body = {}
    body['chainid'] = chain_id
    body['address'] = address
    body['id'] = '13911024683'

    api_url = "http://35.175.145.216:8087/api/v1/chain/exportAddress"

    header = makeHeader(body)
    response = requests.get(api_url, params=body, headers=header)

    json = response.json()
    if json['success'] == True:
        return json['data']
    else:
        print(json)


def getTransactionByHash(hash):
    body = {}
    body['chainid'] = chain_id
    body['hash'] = hash
    body['id'] = '13911024683'

    api_url = "http://35.175.145.216:8087/api/v1/chain/getTransactionByHash"

    header = makeHeader(body)
    response = requests.get(api_url, params=body, headers=header)

    json = response.json()
    if json['success'] == True:
        return json['data']
    else:
        print(json)


def writeCall(_from, data):
    body = {}
    body['chainid'] = chain_id
    body['data'] = data
    body['fromAddress'] = _from
    body['contract'] = contract_add
    body['id'] = '13911024683'

    api_url = "http://35.175.145.216:8087/api/v1/chain/writeCall"

    header = makeHeader(body)
    console.print(body, style="bold yellow")

    response = requests.post(api_url, params=body, headers=header)

    json = response.json()
    if json['success'] == True:
        return json['data']
    else:
        console.print(json, style="bold red")


def readCall(data):
    body = {}
    body['chainid'] = chain_id
    body['data'] = data
    body['contract'] = contract_add
    body['id'] = '13911024683'

    api_url = "http://35.175.145.216:8087/api/v1/chain/readCall"

    header = makeHeader(body)
    # print(body)
    response = requests.get(api_url, params=body, headers=header)

    json = response.json()
    if json['success'] == True:
        return json['data']
    else:
        console.print(json, style="bold red")


def supportsInterface(erc):
    body = {}
    body['chainid'] = chain_id
    body['interfaceID'] = erc
    body['contract'] = contract_add

    api_url = "http://35.175.145.216:8087/api/v1/chain/supportsInterface"

    header = makeHeader(body)
    response = requests.get(api_url, params=body, headers=header)

    json = response.json()
    if json['success'] == True:
        return json['data']
    else:
        console.print(json, style="bold red")


def queryAsset(tokenId):
    body = {}
    body['chainid'] = chain_id
    body['tokenId'] = tokenId
    body['contract'] = contract_add

    api_url = "http://35.175.145.216:8087/api/v1/chain/queryAsset"

    header = makeHeader(body)
    response = requests.get(api_url, params=body, headers=header)

    json = response.json()
    if json['success'] == True:
        return json['data']
    else:
        console.print(json, style="bold red")


def queryUser():
    body = {}
    body['chainid'] = chain_id
    body['id'] = '13911024683'

    header = makeHeader(body)
    api_url = "http://35.175.145.216:8087/api/v1/chain/queryUser"
    response = requests.get(api_url, params=body, headers=header)

    json = response.json()
    if json['success'] == True:
        return json['data']
    else:
        console.print(json, style="bold red")


def createUser():
    body = {}
    body['chainid'] = chain_id
    body['id'] = '13911024683'

    header = makeHeader(body)
    api_url = "http://35.175.145.216:8087/api/v1/chain/create"
    # print(f"{header} {body} {api_url}")
    response = requests.post(api_url, params=body, headers=header)

    # print(response)
    json = response.json()
    if json['success'] == True:
        return json['data']
    else:
        console.print(json, style="bold red")


if __name__ == "__main__":
    if len(sys.argv) == 3:
        contract_add = sys.argv[1]
        chain_id = sys.argv[2]
    print(f"{contract_add=} {chain_id=}")

    while True:
        choice = input("1) createUser\n2) queryUser\n3) queryAsset\n4) supportsInterface\n5) readCall\n6) writeCall\n7) getTransactionReceiptByHash\n8) importAccount\n9) exportAccount\nq) to exit:\n\n")

        commands = choice.split()
        if len(commands) == 0 or commands[0] == "q":
            break
        if commands[0] == '1':
            ret = createUser()
        if commands[0] == '2':
            ret = queryUser()
        if commands[0] == '3':
            ret = queryAsset(commands[1])
        if commands[0] == '4':
            ret = supportsInterface(commands[1])
        if commands[0] == '5':
            ret = readCall(commands[1])
        if commands[0] == '6':
            ret = writeCall(commands[1], commands[2])
        if commands[0] == '7':
            ret = getTransactionByHash(commands[1])
        if commands[0] == '8':
            ret = importAccount(commands[1])
        if commands[0] == '9':
            ret = exportAccount(commands[1])
        console.print(ret, style="white on black")
