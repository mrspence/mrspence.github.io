import { Component } from "react"
import { Formik } from 'formik';
import Icon from '@mdi/react'
import {mdiCheck, mdiChevronRight, mdiSkullCrossbones} from '@mdi/js'

export default class FormContact extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            hasSubmitted: false,
            hasSubmittedWithError: false,
            message: "",
        }
        this.submitHandler = this.submitHandler.bind(this)
    }

    async submitHandler(values, {setSubmitting})
    {
        values.finished_at = Date.now();
        values.duration_seconds = ( values.finished_at - values.started_at ) / 1000;

        const response = await fetch("https://usebasin.com/f/7ea01059dbc6.json", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })

        if (response.status === 200){
            this.setState(state => {
                return {
                    ...state,
                    hasSubmitted: true,
                }
            })
            setSubmitting(false)
            return
        }

        this.setState(state => {
            return {
                ...state,
                hasSubmitted: true,
                hasSubmittedWithError: true,
                message: `${values.name}\n<${values.email}>\n\n${values.enquiry} \n\nP.S Error code was: ${response.status}`,
            }
        })
    }

    /**
     * Validates values and returns an error object. An empty error object means no errors.
     * @param values
     * @returns object
     */
    validator = (values) => Object.keys(values).reduce((errors, name) => {

        const value = values[name]

        // all fields required
        if (false === name.includes("_at") && name !== "duration_seconds" && name !== "phone" && !value){
            errors[name] = `Please enter your ${name}`;
        }
        //validate email
        else if (name === 'email' && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)){
            errors[name] = `Please enter your valid ${name}`;
        }

        return errors;
    }, {})

    renderForm({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting})
    {
        return (
            <form className="form-contact" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="phone"
                    className="!hidden"
                    tabIndex="-1"
                    aria-hidden="true"
                    onChange={handleChange}
                    onBlur={Object.keys(errors).length ? handleBlur : null}
                    value={values.phone}
                />
                <div className="py-4">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="John Augustus"
                        onChange={handleChange}
                        onBlur={Object.keys(errors).length ? handleBlur : null}
                        value={values.name}
                    />
                    <div className="error">
                        {
                            errors.name && touched.name ? (
                                <div>
                                    <span className="inline-block"><Icon size={0.8} path={mdiChevronRight} /></span> {errors.name}
                                </div>
                            ): null
                        }
                    </div>
                </div>
                <div className="py-4">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="j.augustus@company.com"
                        onChange={handleChange}
                        onBlur={Object.keys(errors).length ? handleBlur : null}
                        value={values.email}
                    />
                    <div className="error">
                        {
                            errors.email && touched.email ? (
                                <div>
                                    <span className="inline-block"><Icon size={0.8} path={mdiChevronRight} /></span> {errors.email}
                                </div>
                            ): null
                        }
                    </div>
                </div>
                <div className="py-4">
                    <label htmlFor="enquiry">Message</label>
                    <textarea
                        id="enquiry"
                        placeholder="Questions, opportunities, thoughts..."
                        rows="4"
                        onChange={handleChange}
                        onBlur={Object.keys(errors).length ? handleBlur : null}
                        value={values.enquiry}
                    />
                    <div className="error">
                        {
                            errors.enquiry && touched.enquiry ? (
                                <div>
                                    <span className="inline-block"><Icon size={0.8} path={mdiChevronRight} /></span> {errors.enquiry}
                                </div>
                            ): null
                        }
                    </div>
                </div>
                <div className="text-right py-6">
                    <button
                        className="btn-submit"
                        type="submit"
                        disabled={isSubmitting === true}
                    >
                        Submit
                    </button>
                </div>
            </form>
        )
    }

    render()
    {
        const initialValues = {
            phone: "",
            email: "",
            name: "",
            enquiry: "",
            started_at: Date.now(),
            finished_at: null,
            duration_seconds: null,
        }

        const form = (
            <Formik initialValues={initialValues} validate={this.validator} onSubmit={this.submitHandler}>
                {this.renderForm}
            </Formik>
        )

        const thankyouSuccess = (
            <div>
                <h2 className="text-2xl lg:!text-8xl uppercase !text-secondary !my-0">Sent <span className="inline-block"><Icon size={"1em"} path={mdiCheck} /></span></h2>
                <div className="prose-lg lg:prose-4xl py-4">
                    <p>
                        Thank you, message received! 👋
                    </p>
                </div>
            </div>
        )

        const thankyouFailed = (
            <div>
                <h2 className="text-2xl lg:!text-8xl uppercase !text-secondary !my-0">Dang <span className="inline-block"><Icon size={"1em"} path={mdiSkullCrossbones} /></span></h2>
                <div className="prose-lg lg:prose-4xl py-4 max-w-sm">
                    <p>
                        Thank you for your message, unfortunately it appears there's a problem sending it. 😐
                    </p>
                    <p>
                        This never happens, so if you copy+paste your message to one of my socials I will get back to you with great haste!
                    </p>
                    <p>
                        Your message:
                    </p>
                    <textarea
                        className="mt-0 block w-full px-0.5 border-0 border-b-2 border-secondary bg-transparent focus:ring-0 focus:border-heading text-sm"
                        value={this.state.message}
                        rows="5"
                        readOnly={true}
                    />
                </div>
            </div>
        )

        return (
            <div className="max-w-2xl ml-auto pb-20">
                {this.state.hasSubmitted ? ( this.state.hasSubmittedWithError ? thankyouFailed : thankyouSuccess ) : form}
            </div>
        )
    }
}