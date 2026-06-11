import {
  DeleteOutlined,
  FilterOutlined,
  PlusOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { Button, Empty, Input, Modal, Select, Skeleton } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { LearningRecordCard } from "@/components/records/LearningRecordCard";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { LearningRecordDetailDrawer } from "@/components/records/LearningRecordDetailDrawer";
import { LearningRecordFormDrawer } from "@/components/records/LearningRecordFormDrawer";
import { LEARNING_CATEGORY_OPTIONS } from "@/constants/learningRecords";
import { useLearningRecordStore } from "@/store/useLearningRecordStore";
import type { LearningRecord, TaskCategory } from "@/types/domain";
import { sortLearningRecords } from "@/utils/learningRecords";
import styles from "./LearningRecordsPage.module.css";

type SortDirection = "desc" | "asc";

export function LearningRecordsPage() {
  const { records, loading, error, addRecord, updateRecord, removeRecord } =
    useLearningRecordStore();
  const [category, setCategory] = useState<TaskCategory | "all">("all");
  const [tag, setTag] = useState<string>("all");
  const [keyword, setKeyword] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [editingRecord, setEditingRecord] = useState<LearningRecord | null>(null);
  const [detailRecord, setDetailRecord] = useState<LearningRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const allTags = useMemo(
    () => Array.from(new Set(records.flatMap((record) => record.tags))).sort(),
    [records],
  );

  const filteredRecords = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const result = records.filter((record) => {
      const matchesCategory = category === "all" || record.category === category;
      const matchesTag = tag === "all" || record.tags.includes(tag);
      const matchesKeyword =
        !normalizedKeyword ||
        [
          record.content,
          record.problems,
          record.solutions,
          record.achievements,
          record.nextPlan,
          ...record.tags,
        ].some((value) => value.toLowerCase().includes(normalizedKeyword));
      return matchesCategory && matchesTag && matchesKeyword;
    });
    return sortLearningRecords(result, sortDirection);
  }, [category, keyword, records, sortDirection, tag]);

  const groupedRecords = useMemo(
    () =>
      filteredRecords.reduce<Array<{ date: string; records: LearningRecord[] }>>(
        (groups, record) => {
          const current = groups.at(-1);
          if (current?.date === record.studyDate) {
            current.records.push(record);
          } else {
            groups.push({ date: record.studyDate, records: [record] });
          }
          return groups;
        },
        [],
      ),
    [filteredRecords],
  );

  const openCreate = () => {
    setEditingRecord(null);
    setFormOpen(true);
  };

  const openEdit = (record: LearningRecord) => {
    setDetailRecord(null);
    setEditingRecord(record);
    setFormOpen(true);
  };

  const handleSave = async (record: LearningRecord) => {
    setSaving(true);
    try {
      if (editingRecord) {
        await updateRecord(record);
      } else {
        await addRecord(record);
      }
      setFormOpen(false);
      setEditingRecord(null);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (record: LearningRecord) => {
    Modal.confirm({
      title: "删除这条学习记录？",
      icon: <DeleteOutlined />,
      content: "删除后无法恢复，Dashboard 统计也会同步更新。",
      okText: "删除",
      okButtonProps: { danger: true },
      cancelText: "取消",
      onOk: async () => {
        await removeRecord(record.id);
        if (detailRecord?.id === record.id) setDetailRecord(null);
      },
    });
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>学习沉淀</span>
          <h1>学习记录</h1>
          <p>记录过程、问题与收获，让每次学习都能形成可复用的成果。</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新增记录
        </Button>
      </header>
      <ErrorBanner message={error} />

      <section className={styles.toolbar}>
        <Input.Search
          allowClear
          placeholder="搜索学习内容、收获或标签"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className={styles.search}
        />
        <Select
          value={category}
          onChange={setCategory}
          prefix={<FilterOutlined />}
          options={[
            { value: "all", label: "全部分类" },
            ...LEARNING_CATEGORY_OPTIONS,
          ]}
        />
        <Select
          value={tag}
          onChange={setTag}
          options={[
            { value: "all", label: "全部标签" },
            ...allTags.map((value) => ({ value, label: value })),
          ]}
        />
        <Button
          icon={<SortAscendingOutlined />}
          onClick={() => setSortDirection((value) => (value === "desc" ? "asc" : "desc"))}
        >
          {sortDirection === "desc" ? "日期从新到旧" : "日期从旧到新"}
        </Button>
        <span className={styles.resultCount}>{filteredRecords.length} 条记录</span>
      </section>

      {loading ? (
        <section className={styles.loading}><Skeleton active paragraph={{ rows: 8 }} /></section>
      ) : groupedRecords.length === 0 ? (
        <section className={styles.empty}>
          <Empty
            description={records.length ? "没有符合筛选条件的记录" : "还没有学习记录"}
          >
            {!records.length && <Button type="primary" onClick={openCreate}>创建第一条记录</Button>}
          </Empty>
        </section>
      ) : (
        <div className={styles.timeline}>
          {groupedRecords.map((group) => (
            <section className={styles.dayGroup} key={group.date}>
              <div className={styles.dateColumn}>
                <strong>{dayjs(group.date).format("MM月DD日")}</strong>
                <span>{dayjs(group.date).format("dddd")}</span>
              </div>
              <div className={styles.line}><i /></div>
              <div className={styles.cards}>
                {group.records.map((record) => (
                  <LearningRecordCard
                    key={record.id}
                    record={record}
                    onView={setDetailRecord}
                    onEdit={openEdit}
                    onDelete={confirmDelete}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <LearningRecordFormDrawer
        key={editingRecord?.id ?? "create"}
        open={formOpen}
        record={editingRecord}
        saving={saving}
        onClose={() => {
          setFormOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSave}
      />
      <LearningRecordDetailDrawer
        record={detailRecord}
        open={Boolean(detailRecord)}
        onClose={() => setDetailRecord(null)}
        onEdit={openEdit}
      />
    </div>
  );
}
