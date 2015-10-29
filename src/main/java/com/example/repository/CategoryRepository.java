package com.example.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import com.example.entity.Category;

public interface CategoryRepository extends PagingAndSortingRepository<Category, Long> {

	/**
	 * Find by version is after.
	 *
	 * @param version
	 *            the version
	 * @return the list
	 */
	List<Category> findByVersionIsAfter(@Param(value = "date") Date version);

}
