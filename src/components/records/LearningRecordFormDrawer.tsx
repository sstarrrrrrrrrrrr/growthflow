import { Button, DatePicker, Drawer, Form, Input, InputNumber, Select } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { LEARNING_CATEGORY_OPTIONS } from "@/constants/learningRecords";
import type { LearningRecord, TaskCategory } from "@/types/domain";
import styles from "./LearningRecordFormDrawer.module.css";

interface LearningRecordFormValues {
  studyDate: Dayjs;
  content: string;
  problems: string;
  solutions: string;
  achievements: string;
  nextPlan: string;
  category: TaskCategory;
  tags: string[];
  durationMinutes: number;
}

interface LearningRecordFormDrawerProps {
  open: boolean;
  record: LearningRecord | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (record: LearningRecord) => Promise<void>;
}

const toFormValues = (record: LearningRecord | null): LearningRecordFormValues => ({
  studyDate: record ? dayjs(record.studyDate) : dayjs(),
  content: record?.content ?? "",
  problems: record?.problems ?? "",
  solutions: record?.solutions ?? "",
  achievements: record?.achievements ?? "",
  nextPlan: record?.nextPlan ?? "",
  category: record?.category ?? "study",
  tags: record?.tags ?? [],
  durationMinutes: record?.durationMinutes ?? 60,
});

export function LearningRecordFormDrawer({
  open,
  record,
  saving,
  onClose,
  onSubmit,
}: LearningRecordFormDrawerProps) {
  const [form] = Form.useForm<LearningRecordFormValues>();

  const handleSubmit = async (values: LearningRecordFormValues) => {
    const now = new Date().toISOString();
    await onSubmit({
      id: record?.id ?? crypto.randomUUID(),
      studyDate: values.studyDate.format("YYYY-MM-DD"),
      content: values.content.trim(),
      problems: values.problems.trim(),
      solutions: values.solutions.trim(),
      achievements: values.achievements.trim(),
      nextPlan: values.nextPlan.trim(),
      category: values.category,
      tags: values.tags.map((tag) => tag.trim()).filter(Boolean),
      durationMinutes: values.durationMinutes,
      createdAt: record?.createdAt ?? now,
      updatedAt: now,
    });
    form.resetFields();
  };

  return (
    <Drawer
      title={record ? "编辑学习记录" : "新增学习记录"}
      width={560}
      open={open}
      onClose={onClose}
      destroyOnHidden
      className={styles.drawer}
      extra={
        <div className={styles.actions}>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" loading={saving} onClick={() => form.submit()}>
            {record ? "保存修改" : "保存记录"}
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={toFormValues(record)}
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <div className={styles.grid}>
          <Form.Item
            label="学习日期"
            name="studyDate"
            rules={[{ required: true, message: "请选择学习日期" }]}
          >
            <DatePicker className={styles.fullWidth} allowClear={false} />
          </Form.Item>
          <Form.Item
            label="学习时长"
            name="durationMinutes"
            rules={[
              { required: true, message: "请输入学习时长" },
              { type: "number", min: 1, max: 1440, message: "时长需在 1 到 1440 分钟之间" },
            ]}
          >
            <InputNumber className={styles.fullWidth} min={1} max={1440} addonAfter="分钟" />
          </Form.Item>
        </div>

        <div className={styles.grid}>
          <Form.Item
            label="分类"
            name="category"
            rules={[{ required: true, message: "请选择分类" }]}
          >
            <Select options={LEARNING_CATEGORY_OPTIONS} />
          </Form.Item>
          <Form.Item label="标签" name="tags">
            <Select
              mode="tags"
              tokenSeparators={[",", "，"]}
              placeholder="输入标签后回车"
              maxTagCount="responsive"
            />
          </Form.Item>
        </div>

        <Form.Item
          label="学习内容"
          name="content"
          rules={[
            { required: true, whitespace: true, message: "请填写学习内容" },
            { max: 500, message: "学习内容不能超过 500 字" },
          ]}
        >
          <Input.TextArea rows={4} placeholder="今天学习了什么？" showCount maxLength={500} />
        </Form.Item>
        <Form.Item
          label="遇到的问题"
          name="problems"
          rules={[{ max: 500, message: "问题描述不能超过 500 字" }]}
        >
          <Input.TextArea rows={3} placeholder="学习或实践中遇到了哪些问题？" />
        </Form.Item>
        <Form.Item
          label="解决方案"
          name="solutions"
          rules={[{ max: 500, message: "解决方案不能超过 500 字" }]}
        >
          <Input.TextArea rows={3} placeholder="如何分析和解决这些问题？" />
        </Form.Item>
        <Form.Item
          label="今日收获"
          name="achievements"
          rules={[
            { required: true, whitespace: true, message: "请填写今日收获" },
            { max: 500, message: "今日收获不能超过 500 字" },
          ]}
        >
          <Input.TextArea rows={3} placeholder="今天掌握了什么，有哪些可复用的经验？" />
        </Form.Item>
        <Form.Item
          label="明日计划"
          name="nextPlan"
          rules={[{ max: 500, message: "明日计划不能超过 500 字" }]}
        >
          <Input.TextArea rows={3} placeholder="下一步准备继续做什么？" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
