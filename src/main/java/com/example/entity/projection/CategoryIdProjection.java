package com.example.entity.projection;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import com.example.entity.Post;
import com.example.enums.State;

@Projection(types = { Post.class }, name = "withCategoryId")
public interface CategoryIdProjection {

	Long getId();

	String getName();

	String getContent();

	Integer getNote();

	State getState();

	int getNbComment();

	@Value("#{target.category.id}")
	Long getIdCategory();

}
