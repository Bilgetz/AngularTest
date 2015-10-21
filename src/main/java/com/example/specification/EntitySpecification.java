package com.example.specification;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import javax.persistence.Entity;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;

import lombok.AllArgsConstructor;

/**
 * The Class PostSpecification.
 */
@AllArgsConstructor
public class EntitySpecification<T> implements Specification<T> {

	private final Logger LOG = LoggerFactory.getLogger(EntitySpecification.class);

	/** The criteria. */
	private SearchCriteria criteria;

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.springframework.data.jpa.domain.Specification#toPredicate(javax.
	 * persistence.criteria.Root, javax.persistence.criteria.CriteriaQuery,
	 * javax.persistence.criteria.CriteriaBuilder)
	 */
	@Override
	public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
		LOG.debug("EntitySpecification.toPredicate {} {} {}", root, query, builder);

		Predicate result = null;

		if (criteria.getOperation().equalsIgnoreCase(">")) {
			result = builder.greaterThanOrEqualTo(root.<String> get(criteria.getKey()), criteria.getValue().toString());
		} else if (criteria.getOperation().equalsIgnoreCase("<")) {
			result = builder.lessThanOrEqualTo(root.<String> get(criteria.getKey()), criteria.getValue().toString());
		} else if (criteria.getOperation().equalsIgnoreCase(":")) {
			Class<? extends Object> javaType = root.get(criteria.getKey()).getJavaType();
			if (javaType == String.class) {
				result = builder.like(root.<String> get(criteria.getKey()), "%" + criteria.getValue() + "%");
			} else if (javaType.getAnnotation(Entity.class) != null) {
				result = builder.equal(root.get(criteria.getKey()).get("id"), criteria.getValue());
			} else if (javaType.isEnum()) {
				try {
					Method valueOfMethod = javaType.getMethod("valueOf", String.class);
					Object enumValue = valueOfMethod.invoke(javaType, criteria.getValue());
					result = builder.equal(root.get(criteria.getKey()), enumValue);
				} catch (NoSuchMethodException e) {
					LOG.error("Method not found for Enum", e);
				} catch (SecurityException e) {
					LOG.error("security problem for Enum", e);
				} catch (IllegalAccessException e) {
					LOG.error("IllegalAccessException problem for Enum", e);
				} catch (IllegalArgumentException e) {
					LOG.error("IllegalArgumentException problem for Enum", e);
				} catch (InvocationTargetException e) {
					LOG.error("InvocationTargetException problem for Enum", e);
				}
			} else {
				result = builder.equal(root.get(criteria.getKey()), criteria.getValue());
			}
		}
		LOG.debug("EntitySpecification.toPredicate  result {}", result);
		return result;
	}

}
