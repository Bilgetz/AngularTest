package com.example.repository;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.example.entity.Category;

public interface CategoryRepository extends PagingAndSortingRepository<Category, Long> {

}
