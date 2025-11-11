import React from "react";
import { Formik, ErrorMessage } from "formik";
import { object, string } from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/userReducer";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = async (values) => {
    try {
      const data = values;
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, data);
      if (res?.data?.success) {
        // alert("Login Successful!");
        // localStorage.setItem("user", JSON.stringify(res?.data?.data));
        dispatch(login(res?.data));
        navigate("/dashboard");
      } else {
        alert(res?.data?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
          Flowbite
        </a>
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Sign in to your account</h1>
            <Formik
              enableReinitialize={true}
              initialValues={{ email: "", password: "" }}
              validationSchema={object({
                email: string().email("Invalid Email").required("Email is required"),
                password: string().required("Password is required"),
              })}
              onSubmit={(values) => handleLogin(values)}
            >
              {({ values, setFieldValue, errors, touched, handleBlur, handleSubmit }) => (
                <div class="space-y-4 md:space-y-6">
                  <div>
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Your email
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      onBlur={handleBlur}
                      onChange={(e) => setFieldValue("email", e.target.value)}
                      class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                      value={values.email}
                    />
                    <div className="text-sm text-red-500">{touched?.email && errors?.email ? errors?.email : ""}</div>
                  </div>
                  <div>
                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      onBlur={handleBlur}
                      placeholder="••••••••"
                      onChange={(e) => setFieldValue("password", e.target.value)}
                      class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={values.password}
                    />
                    <div className="text-sm text-red-500">{touched?.password && errors?.password ? errors?.password : ""}</div>
                  </div>
                  <div class="flex items-center justify-between">
                    <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                      Forgot password?
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Sign in
                  </button>
                  <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don’t have an account yet?{" "}
                    <a href="#" class="font-medium text-primary-600 hover:underline dark:text-primary-500">
                      Sign up
                    </a>
                  </p>
                </div>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
