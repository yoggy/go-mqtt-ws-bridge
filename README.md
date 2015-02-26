mqtt-ws-bridge.go
====
websocket-mosquitto bridge sample for mqttws31.js.

* ![http://i.gyazo.com/3e8de5b068bb5ec898b7201a44cddfb4.png](http://i.gyazo.com/3e8de5b068bb5ec898b7201a44cddfb4.png)

How to
----
setup

    $ sudo apt-get install mosquitto mosquitto-client
    $ sudo apt-get install golang
    $ sudo apt-get install git mercurial

    $ vi ~/.bash_profile

        #add below lines...
        export GOPATH=$HOME/go
        export PATH=$PATH:$GOPATH/bin/

    $ . ~/.bash_profile

    $ mkdir ~/go/src/github.com/yoggy
    $ cd ~/go/src/github.com/yoggy
    $ git clone git@github.com:yoggy/go-mqtt-ws-bridge.git

    $ cd go-mqtt-ws-bridge
    $ go get

check server ip address

    $ LANG=C /sbin/ifconfig eth0
    eth0      Link encap:Ethernet  HWaddr xx:xx:xx:xx:xx:xx
              inet addr:192.168.1.123  Bcast:192.168.1.255  Mask:255.255.255.0
              UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
                 .
                 .
                 .

start mqtt-ws-bridge.go

    $ cd ~/go/src/github.com/yoggy/go-mqtt-ws-bridge
    $ go run mqtt-ws-bridge.go

access from web browser

    # mac
    $ open http://192.168.1.123:8080/

    # ubuntu
    $ xdg-open http://192.168.1.123:8080/

    # windows
    > start http://192.168.1.123:8080/

publish a mqtt message to "test_topic".

    $ mosquitto_pub -h localhost -p 1883 -t test_topic -m "test message from cui..."

subscribe to "test_topic"

    $ mosquitto_sub -h localhost -p 1883 -t test_topic

Libraries
----
This sample uses the following libraries.

* websocket - GoDoc
  * https://godoc.org/golang.org/x/net/websocket

* jQuery
  * http://jquery.com/

* Paho - Open Source messaging for M2M
  * https://eclipse.org/paho/clients/js/

* Github Markdown CSS - for Markdown Editor Preview
  * https://gist.github.com/andyferra/2554919)
