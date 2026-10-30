
package com.vcube.restaurantservice.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	@Value("${app.jwt.secret}")
	private String secret;

	@Value("${app.jwt.expiration}")
	private long expiration;

	private SecretKey getSigningKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secret);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public String generateToken(UserDetails userDetails) {
		long now = System.currentTimeMillis();

		return Jwts.builder().subject(userDetails.getUsername()).issuedAt(new Date(now))
				.expiration(new Date(now + expiration)).signWith(getSigningKey()).compact();
	}

	public String extractUsername(String token) {
		return extractAllClaims(token).getSubject();
	}

	public boolean isTokenValid(String token, UserDetails userDetails) {

		try {
			Claims claims = extractAllClaims(token);

			return claims.getSubject().equals(userDetails.getUsername()) && claims.getExpiration().after(new Date());

		} catch (JwtException | IllegalArgumentException ex) {
			return false;
		}
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
	}
}
