const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");
const j2s = require("joi-to-swagger");
const { signUp } = require("../validations/user.validation");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const { swagger: signupSchema, components } = j2s(signUp);
//configs
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("production", "development", "test").required(),
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10).description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10).description("minutes after which verify email token expires"),
    SMTP_HOST: Joi.string().description("server that will send the emails"),
    SMTP_PORT: Joi.number().description("port to connect to the email server"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASSWORD: Joi.string().description("password for email server"),
    EMAIL_FROM: Joi.string().description("the from field in the emails sent by the app"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: "key" } }).validate(process.env);

if (error) {
  console.log();
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT || 3000,
  cookie: (req) => {
    const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      httpOnly: false,
      secure: !!req?.get("origin"), // if origin does not exist it means we are using postman, so turns the secure false
      sameSite: "none", // TODO: check it on production
    };
    if (process.env.NODE_ENV === "production") {
      cookieOptions.sameSite = "none";
      cookieOptions.secure = true;
      cookieOptions.httpOnly = true;
    }
    return cookieOptions;
  },
  mongoose: {
    url:
      process.env.NODE_ENV === "development" ? process.env.DATABASE_LOCAL : process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    // smtp: {
    //   host: envVars.SMTP_HOST,
    //   port: envVars.SMTP_PORT,
    //   auth: {
    //     user: envVars.SMTP_USERNAME,
    //     pass: envVars.SMTP_PASSWORD,
    //   },
    // },
    // from: envVars.EMAIL_FROM,
  },
  limiterOptions: {
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
  },
  swagger: {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "express boilerplate apis",
        description: "api documentation",
        content: {
          name: "a test name",
        },
        servers: ["http://localhost:3000"],
      },
      components: {
        securitySchema: {
          bearerAuth: {
            type: "http",
            schema: "bearer",
            bearerFormat: "JWT",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      paths: {
        "/newSignup": {
          post: {
            summery: "just a test api",
            description: "a test description",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: signupSchema,
                },
              },
            },
            response: {
              200: {
                description: "successful message",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    apis: ["routes/v1/l2/*.routes.js"],
  },
};
