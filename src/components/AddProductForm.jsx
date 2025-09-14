// AddProductForm.jsx
import { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function AddProductForm({ onAdd }) {
    const [expanded, setExpanded] = useState(false);
    const formikRef = useRef(null);

    const productSchema = Yup.object().shape({
        alt: Yup.string().required("Required"),
        category: Yup.string().required("Required"),
        imgFile: Yup.mixed()
            .required("Required")
            .test("fileSize", "File too large", (value) => !value || value.size <= 5 * 1024 * 1024)
            .test(
                "fileType",
                "Unsupported file format",
                (value) =>
                    !value || ["image/jpeg", "image/png", "image/gif"].includes(value.type)
            ),
    });

    const handleButtonClick = () => {
        if (!expanded) setExpanded(true);
        else formikRef.current?.handleSubmit();
    };

    return (
        <div className="me-auto">
            <button
                onClick={handleButtonClick}
                className="dark:bg-blue-950/30 bg-violet-500/50 py-2 px-4 rounded-3xl hover:bg-violet-500 hover:dark:bg-blue-950 transition-colors duration-300 shadow-lg"
            >
                {expanded ? "Add Product" : "Add Product"}
            </button>

            {/* Animated container */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out mt-2 shadow-lg rounded-3xl backdrop-blur-[2px] max-w-96`}
                style={{ maxHeight: expanded ? "500px" : "0" }}
            >
                <div className="dark:bg-blue-950/30 bg-white/5 p-4 rounded-2xl">
                    <Formik
                        innerRef={formikRef}
                        initialValues={{ imgFile: null, alt: "", category: "" }}
                        validationSchema={productSchema}
                        onSubmit={(values, { resetForm }) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                onAdd({
                                    id: Date.now(),
                                    img: reader.result,
                                    alt: values.alt,
                                    category: values.category,
                                });
                                resetForm();
                                setExpanded(false); // collapse after adding
                            };
                            if (values.imgFile) reader.readAsDataURL(values.imgFile);
                        }}
                    >
                        {({ setFieldValue }) => (
                            <Form className="flex flex-col gap-3">
                                <div className="relative">
                                    {/* Invisible native file input */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFieldValue("imgFile", e.currentTarget.files[0])}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />

                                    {/* Styled fake button */}
                                    <div className="border p-2 rounded-2xl bg-white/10 dark:bg-blue-900/30 text-center cursor-pointer hover:bg-violet-500/50 hover:dark:bg-blue-950 transition-colors duration-300">
                                        {formikRef.current?.values?.imgFile?.name || "Choose File"}
                                    </div>
                                </div>

                                {/* Error message with smooth color transition */}
                                <ErrorMessage name="imgFile">
                                    {(msg) => (
                                        <div className="text-red-500 text-xs transition-colors duration-300">{msg}</div>
                                    )}
                                </ErrorMessage>


                                <Field name="alt" placeholder="Product Name" className="border p-2 rounded-2xl" />
                                <div className="text-red-500 text-xs">
                                    <ErrorMessage name="alt" />
                                </div>

                                <Field name="category" placeholder="Category" className="border p-2 rounded-2xl" />
                                <div className="text-red-500 text-xs">
                                    <ErrorMessage name="category" />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
