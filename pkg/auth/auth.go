package auth

import (
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"net/http"
	"strings"
)

var (
	ErrAuthNotConfigured = errors.New("content admin authentication is not configured")
	ErrUnauthorized      = errors.New("admin authentication required")
)

const SpaClientHeader = "X-Content-Admin-Client"

type Env struct {
	ContentAdminUsername string
	ContentAdminPassword string
}

func ShouldSendBrowserAuthChallenge(r *http.Request) bool {
	return r.Header.Get(SpaClientHeader) != "spa"
}

func RequireAdminAuthorization(r *http.Request, env Env) error {
	if env.ContentAdminUsername == "" || env.ContentAdminPassword == "" {
		return ErrAuthNotConfigured
	}
	username, password, ok := decodeBasic(r.Header.Get("Authorization"))
	if !ok || subtle.ConstantTimeCompare([]byte(username), []byte(env.ContentAdminUsername)) != 1 ||
		subtle.ConstantTimeCompare([]byte(password), []byte(env.ContentAdminPassword)) != 1 {
		return ErrUnauthorized
	}
	return nil
}

func decodeBasic(authorization string) (username, password string, ok bool) {
	parts := strings.SplitN(authorization, " ", 2)
	if len(parts) != 2 || parts[0] != "Basic" {
		return "", "", false
	}
	decoded, err := base64.StdEncoding.DecodeString(parts[1])
	if err != nil {
		return "", "", false
	}
	raw := string(decoded)
	idx := strings.IndexByte(raw, ':')
	if idx < 0 {
		return "", "", false
	}
	return raw[:idx], raw[idx+1:], true
}
