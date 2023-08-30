package com.coolSchool.CoolSchool.services.impl;

import com.coolSchool.CoolSchool.exceptions.questions.QuestionNotFoundException;
import com.coolSchool.CoolSchool.exceptions.questions.ValidationQuestionException;
import com.coolSchool.CoolSchool.models.dto.QuestionDTO;
import com.coolSchool.CoolSchool.models.entity.Question;
import com.coolSchool.CoolSchool.repositories.QuestionRepository;
import com.coolSchool.CoolSchool.services.QuestionService;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionException;

import java.util.List;
import java.util.Optional;
@Service
public class QuestionServiceImpl implements QuestionService {
    private final QuestionRepository questionRepository;
    private final ModelMapper modelMapper;
    private final Validator validator;

    public QuestionServiceImpl(QuestionRepository questionRepository, ModelMapper modelMapper, Validator validator) {
        this.questionRepository = questionRepository;
        this.modelMapper = modelMapper;
        this.validator = validator;
    }

    @Override
    public List<QuestionDTO> getAllQuestions() {
        List<Question> questions = questionRepository.findByDeletedFalse();
        return questions.stream().map(question -> modelMapper.map(question, QuestionDTO.class)).toList();
    }

    @Override
    public QuestionDTO getQuestionById(Long id) {
        Optional<Question> question = questionRepository.findByIdAndDeletedFalse(id);
        if (question.isPresent()) {
            return modelMapper.map(question.get(), QuestionDTO.class);
        }
        throw new QuestionNotFoundException();
    }

    @Override
    public QuestionDTO createQuestion(QuestionDTO questionDTO) {
        try {
            questionRepository.save(modelMapper.map(questionDTO, Question.class));
            return questionDTO;
        } catch (ConstraintViolationException exception) {
            throw new ValidationQuestionException(exception.getConstraintViolations());
        }
    }

    @Override
    public QuestionDTO updateQuestion(Long id, QuestionDTO questionDTO) {
        Optional<Question> existingQuestionOptional = questionRepository.findByIdAndDeletedFalse(id);

        if (existingQuestionOptional.isEmpty()) {
            throw new QuestionNotFoundException();
        }

        Question existingQuestion = existingQuestionOptional.get();
        modelMapper.map(questionDTO, existingQuestion);

        try {
            Question updatedQuestion = questionRepository.save(existingQuestion);
            return modelMapper.map(updatedQuestion, QuestionDTO.class);
        } catch (TransactionException exception) {
            if (exception.getRootCause() instanceof ConstraintViolationException validationException) {
                throw new ValidationQuestionException(validationException.getConstraintViolations());
            }
            throw exception;
        }
    }

    @Override
    public void deleteQuestion(Long id) {
        Optional<Question> question = questionRepository.findByIdAndDeletedFalse(id);
        if (question.isPresent()) {
            question.get().setDeleted(true);
            questionRepository.save(question.get());
        } else {
            throw new QuestionNotFoundException();
        }
    }
}
