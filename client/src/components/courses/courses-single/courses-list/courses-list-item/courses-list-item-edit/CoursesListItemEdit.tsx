import { SubmitHandler, useForm } from 'react-hook-form';

import {
  DESCRIPTION_VALIDATIONS,
  TITLE_VALIDATIONS,
} from '../../../../../../validations/courseSubsectionValidations';
import FormInput from '../../../../../common/form-input/FormInput';

import { useFetch } from 'use-http';
import { apiUrlsConfig } from '../../../../../../config/apiUrls';
import { ICourseSubsection } from '../../../../../../types/interfaces/ICourseSubsection';
import FormErrorWrapper from '../../../../../common/form-error-wrapper/FormErrorWrapper';

interface CourseListItemEditProps {
  subsection: ICourseSubsection;
  refreshSubsections: Function;
  courseId: number;
}

type Inputs = {
  Title: string;
  description: string;
};

export default function CoursesListItemEdit({
  subsection,
  refreshSubsections,
  courseId,
}: CourseListItemEditProps) {
  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      Title: subsection.title,
      description: subsection.description,
    },
    mode: 'onChange',
  });

  const { put, response } = useFetch<ICourseSubsection>(
    apiUrlsConfig.courseSubsections.put(subsection.id)
  );

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { resources, ...restSubsection } = subsection;

    const body = {
      ...restSubsection,
      title: data.Title.trim(),
      description: data.description.trim(),
      courseId,
    };

    await put(body);

    if (response.ok) {
      await refreshSubsections();
      reset({ Title: body.title, description: body.description });
    }
  };

  return (
    <section className="signup sub-create">
      <div className="sign-container sub-create-container">
        <div className="signup-content sub-create-content">
          <div className="signup-form create-blog-form">
            <h2 className="form-title">Edit Subsection</h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="register-form"
              id="register-form">
              <FormInput
                control={control}
                name="Title"
                type="text"
                iconClasses="zmdi zmdi-face material-icons-name"
                rules={TITLE_VALIDATIONS}
              />

              <FormErrorWrapper message={errors.description?.message}>
                <div className="blog-create-textarea-wrapper">
                  <h5>Description</h5>
                  <textarea
                    className="form-control"
                    {...register('description', { ...DESCRIPTION_VALIDATIONS })}
                    rows={3}></textarea>
                </div>
              </FormErrorWrapper>

              <div className="form-group form-button">
                <input
                  type="submit"
                  name="signup"
                  id="signup"
                  className="btn_1"
                  value="Submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
