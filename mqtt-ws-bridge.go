package main

import (
	"fmt"
	"golang.org/x/net/websocket"
	"net"
	"net/http"
)

var (
	mqtt_host = "127.0.0.1:1883"
	buf_size  = 1024
)

type Message struct {
	Buf  []byte
	Size int
}

func (msg Message) String() string {
	return ""	
}

func WebsocketBridgeServer(ws *websocket.Conn) {
	addr := ws.RemoteAddr()
	fmt.Println("connect...", addr)

	c, err := net.Dial("tcp", mqtt_host)
	if err != nil {
		fmt.Println("error : net.Dial() failed...err=", err)
		return
	}

	ch_c := make(chan Message)
	ch_ws := make(chan Message)
	ch_quit := make(chan bool, 2)

	go func() {
		for {
			buf := make([]byte, buf_size)
			n, err := ws.Read(buf)
			if err != nil {
				ch_quit <- true
				break
			}
			ch_ws <- Message{buf, n}
		}
	}()

	go func() {
		for {
			buf := make([]byte, buf_size)
			n, err := c.Read(buf)
			if err != nil {
				ch_quit <- true
				break
			}
			ch_c <- Message{buf, n}
		}
	}()

write_loop:
	for {
		select {
		case msg := <-ch_ws:
			_, err := c.Write(msg.Buf[:msg.Size])
			if err != nil {
				break
			}
			fmt.Println("ws->c", msg)
		case msg := <-ch_c:
			err := websocket.Message.Send(ws, msg.Buf[:msg.Size])
			if err != nil {
				break
			}
			fmt.Println("c->ws", msg)
		case <-ch_quit:
			break write_loop
		}
	}

	c.Close()
	fmt.Println("disconnect...", addr)
}

func main() {
	http.Handle("/ws", websocket.Handler(WebsocketBridgeServer))
	http.Handle("/", http.FileServer(http.Dir("./assets/")))

	fmt.Println("start mqtt-ws-bridge...port=8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
