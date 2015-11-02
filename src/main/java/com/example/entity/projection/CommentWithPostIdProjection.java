package com.example.entity.projection;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import com.example.entity.Comment;

@Projection(types = { Comment.class }, name = "withPostId")
public interface CommentWithPostIdProjection {

	Long getId();

	String getName();

	String getContent();

	@Value("#{target.post.id}")
	Long getIdCategory();

}
