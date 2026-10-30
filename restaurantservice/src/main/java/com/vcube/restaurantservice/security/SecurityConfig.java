package com.vcube.restaurantservice.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

	@Autowired
	private JwtAuthenticationFilter jwtAuthenticationFilter;

	@Bean
	public SecurityFilterChain securityFilterChain(
			org.springframework.security.config.annotation.web.builders.HttpSecurity http) throws Exception {

		http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.csrf(csrf -> csrf.disable())
				.httpBasic(basic -> basic.disable())
				.formLogin(form -> form.disable())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth

						// Allow pre-flight OPTIONS requests from React browser
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

						// Allow Swagger UI and API documentation
						.requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/v3/api-docs.yaml")
						.permitAll()

						// Registration and login
						.requestMatchers("/api/v1/auth/**").permitAll()

						// Only ADMIN can create, update, or delete restaurants and food items
						.requestMatchers(HttpMethod.POST, "/api/v1/addRes", "/api/v1/restaurants/**")
						.hasAnyAuthority("ADMIN", "ROLE_ADMIN")
						.requestMatchers(HttpMethod.PUT, "/api/v1/foods/**", "/api/v1/restaurants/**", "/api/v1/*")
						.hasAnyAuthority("ADMIN", "ROLE_ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/api/v1/foods/**", "/api/v1/restaurants/**", "/api/v1/*")
						.hasAnyAuthority("ADMIN", "ROLE_ADMIN")

						// Public GET APIs
						.requestMatchers(HttpMethod.GET, "/api/v1/**").permitAll()

						// Other endpoints require authentication
						.anyRequest().authenticated())
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
		configuration.setAllowedHeaders(List.of("*"));
		configuration.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new PasswordEncoder() {
			private final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();

			@Override
			public String encode(CharSequence rawPassword) {
				return bcrypt.encode(rawPassword);
			}

			@Override
			public boolean matches(CharSequence rawPassword, String encodedPassword) {
				if (encodedPassword == null) return false;
				if (encodedPassword.startsWith("$2a$") || encodedPassword.startsWith("$2b$") || encodedPassword.startsWith("$2y$")) {
					return bcrypt.matches(rawPassword, encodedPassword);
				}
				return rawPassword.toString().equals(encodedPassword);
			}
		};
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}
}
