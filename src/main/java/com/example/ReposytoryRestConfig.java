package com.example;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.core.event.ValidatingRepositoryEventListener;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

import com.example.entity.Category;
import com.example.entity.Comment;
import com.example.entity.Post;
import com.example.validator.CommentValidator;

@Configuration
public class ReposytoryRestConfig extends RepositoryRestConfigurerAdapter {

	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
		super.configureRepositoryRestConfiguration(config);
		config.exposeIdsFor(Post.class, Comment.class, Category.class);
	}

	@Bean
	public CommentValidator beforeCreateCommentValidator() {
		return new CommentValidator();
	}

	@Bean
	public CommentValidator beforeSaveCommentValidator() {
		return new CommentValidator();
	}

	@Override
	public void configureValidatingRepositoryEventListener(ValidatingRepositoryEventListener validatingListener) {
		super.configureValidatingRepositoryEventListener(validatingListener);
		validatingListener.addValidator("beforeSave", beforeSaveCommentValidator());
		validatingListener.addValidator("beforeCreate", beforeCreateCommentValidator());
	}

}
