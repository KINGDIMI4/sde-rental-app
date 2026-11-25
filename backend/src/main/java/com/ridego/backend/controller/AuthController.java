package com.ridego.backend.controller;
import com.ridego.backend.service.AuthService; import jakarta.servlet.http.HttpServletRequest; import jakarta.validation.Valid; import org.springframework.web.bind.annotation.*; import java.util.Map;
@RestController @RequestMapping("/api/auth") public class AuthController {
 private final AuthService auth; public AuthController(AuthService auth){this.auth=auth;}
 private String token(HttpServletRequest r){String h=r.getHeader("Authorization");return h!=null&&h.startsWith("Bearer ")?h.substring(7):null;}
 @PostMapping("/register") public Map<String,Object> register(@Valid @RequestBody Map<String,Object> b){return auth.register(b);}
 @PostMapping("/login") public Map<String,Object> login(@RequestBody Map<String,Object> b){return auth.login(b);}
 @PostMapping("/logout") public Map<String,Object> logout(HttpServletRequest r){auth.logout(token(r));return Map.of("message","Logged out successfully");}
 @GetMapping("/me") public Map<String,Object> me(HttpServletRequest r){return auth.current(token(r));}
}
