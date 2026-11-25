package com.ridego.backend.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Map;

@Service
public class AuthService {
  private final JdbcTemplate db; private final PasswordEncoder encoder; private final SecureRandom random = new SecureRandom();
  public AuthService(JdbcTemplate db, PasswordEncoder encoder) { this.db=db; this.encoder=encoder; }
  public Map<String,Object> register(Map<String,Object> in) {
    String first=req(in,"firstName"), last=req(in,"lastName"), email=req(in,"email").toLowerCase().trim(), pass=req(in,"password");
    if(pass.length()<8) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Password must contain at least 8 characters");
    if(!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Enter a valid email address");
    if(db.queryForObject("select count(*) from users where email=?",Integer.class,email)>0) throw new ResponseStatusException(HttpStatus.CONFLICT,"An account with this email already exists");
    db.update("insert into users(first_name,last_name,email,password_hash,phone,role,is_active) values(?,?,?,?,?,'CUSTOMER',1)",first,last,email,encoder.encode(pass),in.get("phone"));
    return login(Map.of("email",email,"password",pass));
  }
  public Map<String,Object> login(Map<String,Object> in) {
    String email=req(in,"email").toLowerCase().trim(), pass=req(in,"password");
    var rows=db.queryForList("select user_id,first_name,last_name,email,password_hash,role,is_active from users where email=?",email);
    if(rows.isEmpty() || ((Number)rows.get(0).get("IS_ACTIVE")).intValue()!=1 || !encoder.matches(pass,(String)rows.get(0).get("PASSWORD_HASH"))) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password");
    Map<String,Object> u=rows.get(0); String token=newToken(); String hash=sha(token);
    db.update("insert into auth_sessions(user_id,token_hash,expires_at) values(?,?,systimestamp + interval '7' day)",((Number)u.get("USER_ID")).longValue(),hash);
    return Map.of("token",token,"tokenType","Bearer","expiresIn",604800,"user",Map.of("id",u.get("USER_ID"),"firstName",u.get("FIRST_NAME"),"lastName",u.get("LAST_NAME"),"email",u.get("EMAIL"),"role",u.get("ROLE")));
  }
  public Map<String,Object> current(String token) {
    if(token==null || token.isBlank()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Authentication required");
    var r=db.queryForList("select u.user_id,u.first_name,u.last_name,u.email,u.role from auth_sessions s join users u on u.user_id=s.user_id where s.token_hash=? and s.revoked_at is null and s.expires_at>systimestamp and u.is_active=1",sha(token));
    if(r.isEmpty()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Session is invalid or expired"); return r.get(0);
  }
  public void logout(String token) { if(token!=null) db.update("update auth_sessions set revoked_at=systimestamp where token_hash=? and revoked_at is null",sha(token)); }
  public Map<String,Object> requireRole(String token,String... roles) { var u=current(token); String role=u.get("ROLE").toString(); for(String r:roles) if(r.equals(role)) return u; throw new ResponseStatusException(HttpStatus.FORBIDDEN,"You do not have permission to perform this action"); }
  private String newToken(){byte[] b=new byte[32];random.nextBytes(b);return Base64.getUrlEncoder().withoutPadding().encodeToString(b);}
  private String sha(String s){try{return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(s.getBytes()));}catch(Exception e){throw new IllegalStateException(e);}}
  private String req(Map<String,Object> m,String k){Object v=m.get(k);if(v==null||v.toString().isBlank())throw new ResponseStatusException(HttpStatus.BAD_REQUEST,k+" is required");return v.toString();}
}
