export default function (values) {
    const errors = {};
    const requiredFields = [
        'work_instruction',
        'job_number',
        'project_title',
        'issued_date',
        'start_date',
        'end_date',
        'area',
    ];
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required';
        }
    });
    return errors;
}
