import json
import sys
import subprocess

src_ip = sys.argv[1]
dst_ip = sys.argv[2]
outPort = sys.argv[3]
deviceId = sys.argv[4]

with open("files/template.json") as f:
    data = json.load(f)
    data['deviceId'] = "of:000000000000000%d" % (int(deviceId))
    for c in data['selector']['criteria']:
        if c['type'] == "IPV4_SRC":
            c['ip'] = "%s/32" % (src_ip)
        elif c['type'] == "IPV4_DST":
            c['ip'] = "%s/32" % (dst_ip)

    if outPort == "drop":
        data['treatment'] = {}
    else:
        data['treatment']['instructions'][0]['port'] = str(outPort)
    
    with open('files/rule.json', 'w') as outfile:
        json.dump(data, outfile, indent=4)
    
    # file_name = "files/s%s_h%s_h%s.json" % (deviceId, src_ip[-1], dst_ip[-1])
    # with open(file_name, 'w') as outfile:
    #     json.dump(data, outfile, indent=4)

command = "sh files/add_rule.sh %d" % (int(deviceId))
subprocess.run(command, shell=True)