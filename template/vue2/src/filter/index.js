import moment from "moment";
export default (Vue) => {
    Vue.filter("dateMoment", function (value) {
        return moment(value).format("YYYY-MM-DD hh:mm:ss");
    });
};