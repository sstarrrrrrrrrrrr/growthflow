# GrowthFlow

> 一个面向大学生、程序员、自学者和求职者的学习成长管理工具。

GrowthFlow 帮助用户记录学习过程、管理阶段目标，并将自然语言描述转换为结构化 OKR。系统还可以结合指定周期内的学习记录与 OKR 进展，生成可编辑、可导出的周总结。

当前版本为纯前端 MVP，使用本地规则引擎完成内容生成，数据通过 Zustand 与 LocalStorage 管理，无需部署后端即可运行。

## 功能展示

### Dashboard

- 展示本周目标进度、连续学习天数、学习记录数和已生成内容数
- 展示真实保存的本周 OKR 与最近学习记录
- 根据学习记录计算学习热力图
- 在无数据时提供清晰的操作引导

### 学习记录

- 新增、编辑、删除和查看学习记录
- 记录学习内容、问题、解决方案、收获与后续计划
- 支持按日期排序以及按标签、分类筛选
- 采用时间轴与记录卡片展示，避免传统后台表格体验
- 数据变更后自动同步 Dashboard 指标

### OKR 生成

- 支持多行自然语言目标输入
- 使用本地规则引擎生成 Objective 与 Key Results
- 支持重新生成、更加正式、更加简洁、更加细化和更加口语化
- 支持生成结果预览、编辑、保存和删除
- 生成逻辑位于独立 Service 层，可替换为后端或 AI 服务

### 周总结

- 支持本周、上周和自定义日期范围
- 自动聚合学习记录、学习时长、分类分布及 OKR 完成情况
- 提供标准周报、OKR 复盘和学习总结三种模板
- 支持重新生成、风格调整、编辑和历史记录管理
- 支持导出 Markdown 文件

### 设置中心

- 提供六套主题方案
- 支持浅色、深色和跟随系统三种显示模式
- 支持完整业务数据的 JSON 导入与导出
- 导入前执行版本及数据结构校验
- 支持二次确认后清空本地数据，并可选择保留外观设置

## 技术栈

| 分类 | 技术 |
| --- | --- |
| UI 框架 | React 19 |
| 开发语言 | TypeScript 5 |
| 构建工具 | Vite 7 |
| 路由 | React Router 7 |
| 状态管理 | Zustand 5 |
| 基础交互组件 | Ant Design 6 |
| 样式方案 | CSS Modules + CSS Variables |
| 日期处理 | Day.js |
| 数据存储 | LocalStorage |
| 代码检查 | ESLint 9 |

## 项目结构

```text
src/
├── components/          # 通用组件及各业务模块组件
│   ├── common/
│   ├── dashboard/
│   ├── navigation/
│   ├── okr/
│   ├── records/
│   ├── theme/
│   └── weekly-summary/
├── constants/           # 主题和业务常量
├── layouts/             # 应用整体布局
├── pages/               # 路由页面
│   ├── dashboard/
│   ├── okr/
│   ├── records/
│   ├── settings/
│   └── weekly-summary/
├── services/            # 存储、生成、备份和领域服务
├── store/               # Zustand Stores
├── styles/              # 全局样式与主题变量
├── types/               # TypeScript 类型定义
├── utils/               # 数据聚合与业务工具
├── App.tsx              # 路由及全局主题配置
└── main.tsx             # 应用入口
```

## 快速启动

### 环境要求

- Node.js 20 或更高版本
- npm 10 或更高版本

### 安装

```bash
git clone <your-repository-url>
cd GrowthFlow
npm install
```

### 本地开发

```bash
npm run dev
```

Vite 启动后，根据终端提示访问本地开发地址。

### 代码检查

```bash
npm run lint
```

### 生产构建

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
```

## 页面截图

正式发布前，将截图放入 `docs/images/` 并替换下列占位内容。

| 页面 | 截图文件 |
| --- | --- |
| Dashboard | `docs/images/dashboard.png` |
| 学习记录 | `docs/images/learning-records.png` |
| OKR 生成 | `docs/images/okr-generation.png` |
| 周总结 | `docs/images/weekly-summary.png` |
| 设置中心 | `docs/images/settings.png` |
| 深色模式 | `docs/images/dark-mode.png` |

<!--
![GrowthFlow Dashboard](docs/images/dashboard.png)
![GrowthFlow Learning Records](docs/images/learning-records.png)
![GrowthFlow OKR Generation](docs/images/okr-generation.png)
![GrowthFlow Weekly Summary](docs/images/weekly-summary.png)
![GrowthFlow Settings](docs/images/settings.png)
-->

## 核心亮点

- **自然语言规则生成**：无需掌握标准 OKR 写法，即可将学习目标整理为 Objective 与 Key Results。
- **真实数据联动**：Dashboard 指标由学习记录、OKR 和周总结 Store 实时派生，而非静态展示数据。
- **清晰的工程边界**：页面、组件、Store、Service、类型和工具层职责分离，便于后续接入 API。
- **可替换生成架构**：本地规则生成服务拥有独立接口，后续可平滑替换为 AI 或服务端生成。
- **完整数据能力**：支持本地持久化、备份导出、结构校验导入和业务数据清理。
- **全局主题系统**：六套主题通过 CSS Variables 全局生效，并支持浅色、深色与跟随系统模式。
- **按页面拆包**：所有业务页面均采用路由懒加载，并通过 Vendor Chunk 降低首屏业务包体。
- **响应式布局**：覆盖桌面、平板和移动端，窄屏下支持收起侧栏与单列卡片布局。

## 主题系统

GrowthFlow 内置以下主题：

| 主题标识 | 主色 | 强调色 |
| --- | --- | --- |
| `purple-yellow` | `#7b2cbf` | `#fff000` |
| `blue-lime` | `#0036ff` | `#b5f800` |
| `pink-green` | `#ff449e` | `#acfe6c` |
| `violet-cyan` | `#9d00ff` | `#00f0ff` |
| `coral-cyan` | `#ff527c` | `#00ffff` |
| `red-green` | `#db0530` | `#8aff8a` |

主题与显示模式会持久化到 LocalStorage，并对所有页面同步生效。选择 `system` 模式时，应用会监听 `prefers-color-scheme` 的变化。

## 数据与隐私

当前版本不会将数据发送到远程服务器。学习记录、OKR、周总结和应用设置均保存在浏览器 LocalStorage 中。

请注意：

- 清理浏览器数据可能导致本地内容丢失。
- 建议定期通过设置中心导出 JSON 备份。
- 导入操作会验证备份版本和必要字段，非法数据不会覆盖现有内容。

## 后续规划

### V1.0：本地 MVP

- 学习记录管理
- 本地 OKR 与周总结规则生成
- Dashboard 数据联动
- 主题、深色模式和数据备份

### V2.0：后端服务

- 接入 NestJS 与 MySQL
- 用户认证与数据同步
- REST API 与服务端数据校验
- 数据迁移与版本管理

### V3.0：AI 能力

- 接入 AI OKR 与周总结生成
- 流式输出与生成历史
- 自定义 Prompt 和模板
- AI 服务失败降级与额度控制

### V4.0：多人协作

- 团队空间与成员权限
- 共享 OKR 和项目进度
- 评论、通知与变更记录
- 多端同步与协作审计

## 贡献

当前项目处于 MVP 交付阶段。准备接受社区贡献时，建议补充 `CONTRIBUTING.md`、Issue 模板、Pull Request 模板以及行为准则。

提交变更前请确保以下命令通过：

```bash
npm run lint
npm run build
```

## License

当前仓库尚未包含开源许可证文件。在添加明确的 `LICENSE` 前，项目代码默认不授予复制、修改或再分发许可。

若计划以开源项目公开发布，建议在发布前确认版权归属并添加合适的许可证，例如 [MIT License](https://opensource.org/license/mit)。
