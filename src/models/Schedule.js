/**
 * MongoDB Schedule 스키마 정의
 * - 스케줄 데이터를 MongoDB에 저장/조회할 때 사용
 */

import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
    {
        schedule_id: {
            type: String,
            required: true,
            unique: true,
        },
        detail: {
            type: String,
            required: true,
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
        run_at: {
            type: String, // Cron 표현식 (예: '0 0 * * *')
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
    },
    {
        collection: "schedules", // MongoDB 컬렉션 이름
    }
);

export default mongoose.model("Schedule", ScheduleSchema);
