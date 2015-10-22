package com.example;

import java.util.Locale;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import com.example.internationalization.CustomResourceBundleMessageSource;

@Configuration
public class ViewConfig extends WebMvcConfigurerAdapter {

	@Bean(name = "localeResolver")
	public SessionLocaleResolver getLocalResolver() {
		SessionLocaleResolver resolver = new SessionLocaleResolver();
		resolver.setDefaultLocale(Locale.FRENCH);
		return resolver;
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		LocaleChangeInterceptor localeChangeInterceptor = new LocaleChangeInterceptor();
		localeChangeInterceptor.setParamName("lang");
		registry.addInterceptor(localeChangeInterceptor);
	}

	@Bean
	public CustomResourceBundleMessageSource messageSource() {
		CustomResourceBundleMessageSource bean = new CustomResourceBundleMessageSource();
		// #spring.messages.basename=messages
		bean.setBasename("messages");
		// #spring.messages.encoding=UTF-8
		bean.setDefaultEncoding("UTF-8");
		// #spring.messages.cache-seconds=-1
		bean.setCacheSeconds(-1);
		// #spring.messages.fallback-to-system-locale=true
		bean.setFallbackToSystemLocale(true);

		return bean;
	}

}
