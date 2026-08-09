package auth

import (
	"encoding/base64"
	"net/http/httptest"
	"testing"
)

func testEnv(username, password string) Env {
	return Env{ContentAdminUsername: username, ContentAdminPassword: password}
}

func basicAuth(user, pass string) string {
	return "Basic " + base64.StdEncoding.EncodeToString([]byte(user+":"+pass))
}

func TestRequireAdminAuthorizationOK(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	req.Header.Set("Authorization", basicAuth("admin", "secret"))
	if err := RequireAdminAuthorization(req, testEnv("admin", "secret")); err != nil {
		t.Fatalf("unexpected err: %v", err)
	}
}

func TestRequireAdminAuthorizationMissingConfig(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	err := RequireAdminAuthorization(req, testEnv("", ""))
	if err == nil || err != ErrAuthNotConfigured {
		t.Fatalf("err = %v, want ErrAuthNotConfigured", err)
	}
}

func TestRequireAdminAuthorizationBadCredentials(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	req.Header.Set("Authorization", basicAuth("admin", "wrong"))
	err := RequireAdminAuthorization(req, testEnv("admin", "secret"))
	if err == nil || err != ErrUnauthorized {
		t.Fatalf("err = %v, want ErrUnauthorized", err)
	}
}

func TestRequireAdminAuthorizationMissingHeader(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	err := RequireAdminAuthorization(req, testEnv("admin", "secret"))
	if err == nil || err != ErrUnauthorized {
		t.Fatalf("err = %v, want ErrUnauthorized", err)
	}
}

func TestShouldSendBrowserAuthChallenge(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	if !ShouldSendBrowserAuthChallenge(req) {
		t.Fatal("no spa header => want challenge")
	}
	req.Header.Set("X-Content-Admin-Client", "spa")
	if ShouldSendBrowserAuthChallenge(req) {
		t.Fatal("spa header => want no challenge")
	}
}

func TestRequireAdminAuthorizationMalformedHeader(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	req.Header.Set("Authorization", "Bearer garbage")
	err := RequireAdminAuthorization(req, testEnv("admin", "secret"))
	if err == nil || err != ErrUnauthorized {
		t.Fatalf("err = %v, want ErrUnauthorized", err)
	}
}
