package social.utc2.constants;

public class Constant {
    public static class WEB_CONSTANT {

        public static final String TOKEN = "X-TOKEN";
    }

    public static class API {

        public static final String USER = "/user";

        public static final String LOGIN = "/login";

        public static final String IN_OUT = "/in-out";

        public static final String TICKET_MONTH = "/ticket-month";

        public static final String CUSTOMER = "/customer";

        public static final String COMPUTER = "/computer";

        public static final String FACILITY = "/facility";

        public static final String LICENCE = "/licence";

        public static final String LOST_CARD = "/lost-card";

        public static final String PART = "/part";

        public static final String EXPENDITURE = "/expenditure";

        public static final String DEVICE = "/device";

        public static final String DEVICE_LOG = "/device-log";

        public static final String LOG = "/log";

        public static final String CARD = "/card";
    }

    public static class ROLE {

        public static final String ADMIN = "1";

        public static final String USER = "0";
    }

    public static class PROCESS_TYPE {

        public static final String INSERT = "insert";

        public static final String UPDATE = "update";
    }

    public static class ERROR {

        public static final String USERNAME_EXIST = "USERNAME IS EXIST";
    }
}
