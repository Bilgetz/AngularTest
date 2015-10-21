package com.example;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;

@Configuration
public class SecurityConfig extends GlobalAuthenticationConfigurerAdapter {
	@Override
	public void init(AuthenticationManagerBuilder auth) throws Exception {
		// @formatter:off
		auth.inMemoryAuthentication()
			.withUser("admin").password("admin").roles("ADMIN", "USER").and()
			.withUser("user").password("user").roles("USER");
		// @formatter:on
	}
}
