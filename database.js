// MongoDB 연결 설정
mongoose.connect("mongodb://localhost:27017/admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
  
export const ScheduleSchema = new mongoose.Schema({
    crontab: String,
    provider: String,
    type: String,
    api: String,
    detailUrl: String,
    data: String,
});
export const Schedule = mongoose.model("Schedule", ScheduleSchema);