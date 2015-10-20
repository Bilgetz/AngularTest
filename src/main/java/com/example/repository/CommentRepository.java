package com.example.repository;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.example.entity.Comment;

public interface CommentRepository extends PagingAndSortingRepository<Comment, Long> {

}
