package com.example.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.security.access.prepost.PreAuthorize;

import com.example.entity.Comment;

public interface CommentRepository extends PagingAndSortingRepository<Comment, Long> {

	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void delete(Comment entity);

	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void delete(Long id);

	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void deleteAll();

	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void delete(Iterable<? extends Comment> entities);
}
