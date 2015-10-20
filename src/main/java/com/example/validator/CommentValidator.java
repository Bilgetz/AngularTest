package com.example.validator;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import com.example.entity.Comment;

/**
 * The Class CommentValidator.
 */
public class CommentValidator implements Validator{

	/* (non-Javadoc)
	 * @see org.springframework.validation.Validator#supports(java.lang.Class)
	 */
	@Override
	public boolean supports(Class<?> arg0) {
		return Comment.class.isAssignableFrom(arg0);
	}

	/* (non-Javadoc)
	 * @see org.springframework.validation.Validator#validate(java.lang.Object, org.springframework.validation.Errors)
	 */
	@Override
	public void validate(Object arg0, Errors error) {
		Comment comment = (Comment) arg0;
		ValidationUtils.rejectIfEmptyOrWhitespace(error, "content", "error.empty");
		ValidationUtils.rejectIfEmptyOrWhitespace(error, "name", "error.empty");
		//error.rejectValue("content","error.test",new Object[] {1, "toto", 1.5},"default");
	}


}
