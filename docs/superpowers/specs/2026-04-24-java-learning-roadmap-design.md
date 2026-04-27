# Java → AI 全栈学习路线图 — 设计文档

> 面向 5 年前端开发者转型 AI 全栈（Java 先行）的交互式学习平台
> 日期：2026-04-24 | 版本：v1.0

---

## 1. 项目概述

### 1.1 目标
构建一个**可独立部署的前端单页应用（SPA）**，为从零开始学 Java、最终衔接 AI 全栈开发的前端工程师提供：
- 完整的 Java 知识体系（深度原理 + 浅显描述 + 业务场景 + 代码示例）
- 系统的学习课程（分阶段、有次序）
- 真实可落地的学习计划（含时间分配和里程碑）

### 1.2 用户画像
- 5 年纯 JavaScript 前端开发经验（React / Vue）
- 无 TypeScript、SQL、Linux 命令行经验
- 偏好系统化学习（先理论再实践）
- 每日可投入 1~2 小时

### 1.3 技术栈
| 层 | 选择 | 理由 |
|---|------|------|
| 框架 | Vue 3（Composition API + `<script setup>`） | 用户熟悉 Vue，开发效率高 |
| 构建 | Vite 5 | 快速冷启动，零配置 HMR |
| 路由 | Vue Router 4 | SPA 页面导航 |
| 状态管理 | Pinia + localStorage | 轻量，持久化学习进度 |
| 代码高亮 | highlight.js | Java 代码语法着色 |
| 样式 | CSS Variables + 自定义样式 | 零依赖，完全可控 |
| 部署 | Vercel / Netlify | 免费、一键部署、全球 CDN |

---

## 2. 内容架构（三层知识体系）

```
Phase（学习阶段）        12 个阶段，按时间线排列
  └─ Topic（主题模块）    每阶段 5~15 个主题
       └─ KnowledgePoint  每个主题下 N 个原子知识点
           ├─ shortDesc        一句话浅显解释
           ├─ deepPrinciple    深度原理剖析（含图解/类比）
           ├─ scenario         真实业务场景举例
           ├─ codeExample      可直接运行的 Java 代码
           └─ estimatedMinutes 预计学习时长
```

### 2.1 12 个学习阶段

| # | 阶段名称 | 主题数 | 预估周数 | 说明 |
|---|---------|--------|---------|------|
| 0 | **前置基础** | 8 | 2 周 | SQL 入门、Linux 基本命令、开发环境搭建 |
| 1 | **Java 核心语法** | 10 | 2 周 | 变量、运算符、控制流、数组、方法 |
| 2 | **面向对象编程** | 12 | 4 周 | 类/对象、封装/继承/多态、抽象类、接口、内部类 |
| 3 | **核心类库与集合** | 10 | 3 周 | String、集合框架(List/Set/Map)、泛型、日期时间 |
| 4 | **异常与 IO** | 8 | 2 周 | 异常体系、try-catch-finally、文件流、序列化 |
| 5 | **多线程与并发** | 10 | 3 周 | Thread、线程池、synchronized、Lock、JUC 工具 |
| 6 | **JVM 原理（浅尝）** | 6 | 1 周 | 内存模型、类加载、GC 算法、调优入门 |
| 7 | **数据库编程** | 8 | 2 周 | JDBC、连接池(HikariCP)、事务、SQL 注入防护 |
| 8 | **Spring Boot 实战** | 14 | 4 周 | IoC/DI、REST API、MyBatis、Spring Data JPA、Redis |
| 9 | **Redis 详解** | 8 | 2 周 | 数据结构、持久化、缓存策略、分布式锁、Spring Boot 集成 |
| 10 | **工程化能力** | 8 | 2 周 | Maven/Gradle、JUnit、SLF4J/Logback、Git 协作 |
| 11 | **AI 全栈衔接** | 8 | 2 周 | HTTP 调用 AI API、SSE 流式响应、Python 入门、路线展望 |

> **总计：约 31 周（每天 1~2 小时），约 7~8 个月**

### 2.2 知识点深度设计原则

每个 `KnowledgePoint` 遵循 **「浅 → 深 → 用」** 的认知路径：

```
浅显描述（1 句话类比）
    ↓
深度原理（为什么这样设计？底层如何实现？）
    ↓
业务场景（什么情况下会用到？）
    ↓
代码示例（直接可运行的示例）
```

---

## 3. 前端架构设计

### 3.1 路由设计

```
/                    → DashboardView      首页仪表盘
/roadmap             → RoadmapView        学习路线总览（时间线）
/phase/:phaseId      → PhaseDetailView    阶段详情（主题列表）
/knowledge/:kpId     → KnowledgePointView 知识点详情（原理+场景+代码）
/resources           → ResourcesView      资源导航
```

### 3.2 页面功能详述

#### 3.2.1 DashboardView (`/`)
- **整体进度环**：已学知识点 / 总知识点，百分比 + 环状图
- **当前阶段卡片**：显示当前正在学习的阶段、主题进度
- **今日推荐**：根据学习计划推荐 3~5 个当日知识点
- **快速统计**：总学习时长估算、连续打卡天数
- **快捷入口**：跳转到路线图、资源页

#### 3.2.2 RoadmapView (`/roadmap`)
- **垂直时间线**：12 个阶段按顺序排列
- **阶段卡片**：显示阶段名称、主题数、已学/总数、预估时长
- **展开/折叠**：点击展开可查看该阶段下的所有主题
- **进度指示**：每个阶段和主题都有进度条
- **跳转**：点击主题 → 进入阶段详情页

#### 3.2.3 PhaseDetailView (`/phase/:phaseId`)
- **阶段概述**：目标、前置要求、预估总时长
- **主题手风琴列表**：点击展开看知识点
- **知识点卡片列表**：标题 + 一句话描述 + 学习状态标记
- **全部展开/折叠**、**一键标记本主题完成**

#### 3.2.4 KnowledgePointView (`/knowledge/:kpId`)
核心页面，展示单个知识点的完整内容：
- **浅显描述区**：大标题 + 生活化类比
- **深度原理区**：结构化文本 + 配图/示意图（ASCII art 或插图占位）
- **业务场景区**：真实项目中的使用案例
- **代码示例区**：带语法高亮的 Java 代码块（可复制）
- **学习操作**：标记"已理解"按钮、学习计时、笔记区（localStorage）
- **上下导航**：上一个/下一个知识点

#### 3.2.5 ResourcesView (`/resources`)
- **分类资源卡片**：按阶段分类
- **资源类型标签**：书籍、视频、文档、GitHub 仓库
- **难度标签**：入门 / 进阶 / 深入
- **外部链接**：直接跳转到对应资源

### 3.3 组件树

```
App.vue
├── AppHeader.vue
│   ├── Logo + 标题
│   ├── 导航链接（Dashboard / 路线图 / 资源）
│   └── 全局进度条（总完成百分比）
├── <RouterView>
│   ├── DashboardView.vue
│   │   ├── ProgressRing.vue          — 环状进度图
│   │   ├── CurrentPhaseCard.vue      — 当前阶段卡片
│   │   ├── TodayRecommend.vue        — 今日推荐任务列表
│   │   └── QuickStats.vue            — 快速统计
│   │
│   ├── RoadmapView.vue
│   │   ├── TimelineProgress.vue      — 总体进度条
│   │   └── PhaseCard.vue (×12)       — 阶段卡片
│   │       └── TopicBadge.vue        — 主题标签
│   │
│   ├── PhaseDetailView.vue
│   │   ├── PhaseHeader.vue           — 阶段标题和信息
│   │   └── TopicAccordion.vue (×N)   — 主题手风琴
│   │       └── KpListItem.vue        — 知识点列表项
│   │
│   ├── KnowledgePointView.vue
│   │   ├── KpHeader.vue              — 知识点标题 + 浅显描述
│   │   ├── PrincipleSection.vue      — 深度原理
│   │   ├── ScenarioSection.vue       — 业务场景
│   │   ├── CodeBlock.vue             — 代码示例（高亮 + 复制）
│   │   ├── KpActions.vue             — 操作按钮（标为已学/笔记）
│   │   └── KpNav.vue                 — 上/下一个知识点导航
│   │
│   └── ResourcesView.vue
│       ├── ResourceFilter.vue        — 分类筛选
│       └── ResourceCard.vue (×N)     — 资源卡片
│
└── AppFooter.vue
```

### 3.4 状态管理（Pinia Store）

```js
// useProgressStore
{
  // 状态
  completedKps: Set<string>,         // 已学知识点 ID 集合
  completedTopics: Set<string>,      // 已完成主题 ID 集合
  notes: Map<string, string>,        // 知识点笔记
  streak: number,                    // 连续学习天数
  lastStudyDate: string,            // 最后学习日期

  // 动作
  markKpComplete(kpId): void,
  markTopicComplete(topicId): void,
  saveNote(kpId, note): void,
  updateStreak(): void,
  resetProgress(): void,

  // 计算
  totalProgress: number,             // 总体完成百分比
  phaseProgress(phaseId): number,    // 某个阶段完成百分比
  todayTasks: KnowledgePoint[],      // 今日推荐任务
}
```

数据持久化：Pinia 插件自动同步到 `localStorage`。

### 3.5 数据模型

```typescript
interface KnowledgePoint {
  id: string;                    // 如 "java-basics-variables-01"
  title: string;                 // 如 "变量的声明与初始化"
  shortDesc: string;             // 一句话浅显描述
  deepPrinciple: string;         // 深度原理（Markdown 格式）
  scenario: string;              // 真实业务场景
  codeExample: string;           // Java 代码示例
  estimatedMinutes: number;      // 预计学习时间（分钟）
  tags: string[];                // 标签：["基础", "必学"]
}

interface Topic {
  id: string;
  title: string;
  description: string;
  knowledgePoints: KnowledgePoint[];
  estimatedHours: number;
  prerequisite?: string[];       // 前置主题 ID
}

interface Phase {
  id: string;
  order: number;                 // 排序序号
  title: string;                 // 阶段名称
  subtitle: string;              // 副标题
  goal: string;                  // 阶段目标
  topics: Topic[];
  estimatedWeeks: number;
  prerequisite?: string[];       // 前置阶段 ID
  resources: Resource[];         // 推荐资源
}

interface Resource {
  title: string;
  url: string;
  type: 'book' | 'video' | 'doc' | 'github';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  phaseId: string;
}
```

### 3.6 内容文件组织

所有教学内容以静态 JSON 文件形式存放，构建时打包进应用：

```
src/
├── data/
│   ├── phases.ts              — 阶段元数据 + 主题结构
│   ├── knowledge-points/
│   │   ├── phase-0-prepare.ts     — 前置基础知识点
│   │   ├── phase-1-core.ts        — Java 核心语法知识点
│   │   ├── phase-2-oop.ts         — 面向对象知识点
│   │   ├── phase-3-collections.ts
│   │   ├── phase-4-exception-io.ts
│   │   ├── phase-5-concurrency.ts
│   │   ├── phase-6-jvm.ts
│   │   ├── phase-7-database.ts
│   │   ├── phase-8-springboot.ts  — Spring Boot + Redis 基础
│   │   ├── phase-9-redis.ts       — Redis 详解
│   │   ├── phase-10-engineering.ts
│   │   └── phase-11-ai-bridge.ts
│   └── resources.ts           — 推荐资源列表
```

---

## 4. UI/UX 设计

### 4.1 设计系统

| 属性 | 值 |
|------|---|
| 主色调 | `#2563EB`（蓝色，科技感 + 可信赖） |
| 成功色 | `#10B981`（表示完成/已学） |
| 警告色 | `#F59E0B`（进行中） |
| 背景色 | `#F8FAFC`（浅灰） |
| 卡片背景 | `#FFFFFF` |
| 文字色 | `#1E293B`（深灰，主文字） |
| 次要文字 | `#64748B` |
| 代码背景 | `#1E293B`（深色，代码块） |
| 圆角 | 8px（卡片）/ 4px（按钮） |
| 字体 | 系统默认中文字体 + JetBrains Mono（代码） |

### 4.2 响应式策略
- `≥1024px`：桌面布局（侧边时间线 + 主内容区）
- `768~1023px`：平板布局（顶部导航 + 单列内容）
- `<768px`：手机布局（底部导航栏 + 单列）

### 4.3 交互细节
- 知识点卡片悬停 → 轻微上浮 + 阴影加深
- 标记已学 → 勾选动画 + 进度条实时更新
- 代码块 → 一键复制按钮 + 语言标签
- 主题手风琴 → 展开/折叠动画（`<Transition>`）

---

## 5. 核心内容编排（12 阶段知识地图）

### Phase 0：前置基础（2 周）

| 主题 | 核心知识点 | 学习重点 |
|------|-----------|---------|
| SQL 入门 | SELECT/INSERT/UPDATE/DELETE、WHERE 条件、JOIN 联表 | **必学**：CRUD + 简单查询 |
| 数据库概念 | 表/行/列、主键、外键、索引概念 | 理解即可 |
| MySQL 安装 | Windows 安装、基本配置、Navicat 连接 | 动手操作 |
| Linux 基础命令 | ls/cd/mkdir/rm/cp/mv、权限 chmod、管道 | **必学**：文件操作 + 权限 |
| Git 基础 | clone/commit/push/pull/branch | **必学**：基本协作流程 |
| JDK 安装 | JDK 17 安装、环境变量配置、`java -version` | 动手操作 |
| IntelliJ IDEA | 安装、创建项目、调试、快捷键 | 动手操作 |
| 第一个 Java 程序 | `HelloWorld`、`main` 方法、编译运行 | 建立信心 |

### Phase 1：Java 核心语法（2 周）

| 主题 | 核心知识点 | 对比 JS |
|------|-----------|---------|
| 变量与数据类型 | 8 种基本类型、引用类型、类型转换 | JS 的 `let/const` vs Java 的强类型声明 |
| 运算符 | 算术/关系/逻辑/位运算符、`++`/`--` | 大部分与 JS 相同 |
| 字符串 | `String` 不可变性、字符串池、常用方法 | Java String 是对象，JS 是原始类型 |
| 控制流 | `if-else`、`switch`、`for`、`while`、`do-while` | 语法几乎一致 |
| 数组 | 声明、初始化、遍历、`Arrays` 工具类 | Java 数组定长，JS 数组可变 |
| 方法定义 | 签名、参数传递（值传递）、返回值 | Java 必须声明返回类型 |
| 方法重载 | 同名方法、不同参数列表 | JS 无此概念（后者覆盖前者） |
| 变量作用域 | 块级作用域、成员变量 vs 局部变量 | `var` 的坑 vs Java 严格作用域 |
| 包装类 | `Integer`/`Long` 等、自动装箱拆箱 | 类比 JS 的 `Number` 对象 |
| 控制台 IO | `Scanner` 读取输入、`System.out` | 类比 `prompt()` / `console.log()` |

### Phase 2：面向对象编程（4 周）

| 主题 | 核心知识点 | 与前端类比 |
|------|-----------|-----------|
| 类与对象 | `class` 定义、`new` 实例化、构造方法 | 类似 JS 的 class（ES6） |
| 封装 | `private`/`public`/`protected`、getter/setter | Vue 组件的 `props` 单向数据流 |
| this 关键字 | 指向当前对象、`this()` 调用构造器 | JS 的 `this` 更复杂 |
| static 静态 | 静态变量/方法/代码块 | 类似模块级别的共享状态 |
| 继承 | `extends`、`super`、方法重写 | 类似 `class Dog extends Animal` |
| 多态 | 向上转型、动态绑定、`instanceof` | 组件插槽/策略模式思想 |
| 抽象类 | `abstract` 修饰、模板方法模式 | 无法直接类比，类似 Vue mixin 抽象 |
| 接口 | `interface`、`implements`、默认方法 | 类似 TypeScript 的 interface |
| 内部类 | 成员内部类、匿名内部类 | 类似闭包中的函数 |
| 枚举 | `enum` 定义、构造器、方法 | JS 无原生枚举，常用 Object.freeze |
| 注解 | `@Override`等内置注解、元注解 | 类似装饰器（decorator）概念 |
| 反射 | `Class` 类、获取字段/方法 | 类似 JS 的 `Reflect` API |

### Phase 3：核心类库与集合（3 周）

| 主题 | 核心知识点 |
|------|-----------|
| String 进阶 | StringBuilder/StringBuffer、正则、格式化 |
| 包装类深入 | 缓存机制（IntegerCache）、比较 `==` vs `equals` |
| ArrayList | 底层数组、扩容机制、与 LinkedList 对比 |
| LinkedList | 双向链表、队列/栈操作 |
| HashSet/HashMap | **哈希表原理**、`hashCode`/`equals` 契约、扩容 |
| TreeSet/TreeMap | 红黑树、自然排序 vs 比较器 |
| 泛型 | 类型擦除、通配符 `?`、`extends`/`super` |
| 日期时间 | `LocalDate`/`LocalDateTime`、格式化/解析 |
| Collections 工具 | 排序、查找、同步包装 |
| Stream API | 流式操作、map/filter/reduce、并行流 |

### Phase 4：异常与 IO（2 周）

| 主题 | 核心知识点 |
|------|-----------|
| 异常体系 | Throwable → Error / Exception、受检 vs 非受检 |
| try-catch-finally | 多重捕获、资源自动关闭 try-with-resources |
| 自定义异常 | 继承 Exception/RuntimeException |
| File 类 | 路径、创建/删除/遍历 |
| 字节流 | InputStream/OutputStream、FileInputStream |
| 字符流 | Reader/Writer、FileReader/BufferedReader |
| 序列化 | Serializable 接口、transient、serialVersionUID |
| NIO 入门 | Buffer、Channel、Path/Files 工具类 |

### Phase 5：多线程与并发（3 周）

| 主题 | 核心知识点 |
|------|-----------|
| 线程创建 | Thread 类、Runnable 接口 |
| 线程生命周期 | NEW → RUNNABLE → BLOCKED → WAITING → TERMINATED |
| synchronized | 对象锁、类锁、wait/notify |
| volatile | 可见性保证、禁止指令重排 |
| 线程池 | **ThreadPoolExecutor**、核心参数、拒绝策略 |
| Executors | newFixedThreadPool、newCachedThreadPool |
| Lock | ReentrantLock、Condition、读写锁 |
| 并发集合 | ConcurrentHashMap、CopyOnWriteArrayList |
| JUC 工具 | CountDownLatch、CyclicBarrier、Semaphore |
| ThreadLocal | 线程局部变量、内存泄漏风险 |

### Phase 6：JVM 原理（浅尝）（1 周）

| 主题 | 核心知识点 |
|------|-----------|
| JVM 架构 | 类加载器 → 运行时数据区 → 执行引擎 |
| 内存模型 | 堆/栈/方法区/程序计数器、**对象创建过程** |
| 类加载机制 | 双亲委派模型、加载/链接/初始化 |
| GC 算法 | 标记-清除/复制/标记-整理、**分代回收** |
| GC 调优入门 | 常用 JVM 参数、jstat/jmap 工具 |
| 内存溢出 | OOM 原因排查、堆 dump 分析 |

### Phase 7：数据库编程（2 周）

| 主题 | 核心知识点 |
|------|-----------|
| JDBC 基础 | DriverManager、Connection、Statement |
| PreparedStatement | **SQL 注入防护**、参数化查询 |
| 结果集处理 | ResultSet、元数据 |
| 事务管理 | ACID、隔离级别、Spring 事务 |
| HikariCP | **高性能连接池**、配置参数 |
| ORM 概念 | MyBatis vs JPA、映射思想 |
| 数据库设计基础 | 范式、索引优化入门 |
| 实战 | 学生管理系统数据库设计 |

### Phase 8：Spring Boot 实战（4 周）

| 主题 | 核心知识点 |
|------|-----------|
| Spring 核心 | **IoC 容器**、依赖注入（`@Autowired`） |
| Bean 生命周期 | `@Component`/`@Service`/`@Repository`、作用域 |
| Spring Boot 启动 | `@SpringBootApplication`、自动配置原理 |
| REST API | `@RestController`、`@GetMapping`/`@PostMapping` |
| 请求参数处理 | `@RequestParam`/`@PathVariable`/`@RequestBody` |
| 响应处理 | 统一返回格式、`ResponseEntity` |
| 异常处理 | `@ControllerAdvice`、全局异常处理 |
| 参数校验 | `@Valid`、Bean Validation |
| MyBatis 集成 | 注解 SQL、XML 映射、分页 |
| Spring Data JPA | 实体类、Repository、JPQL |
| **Spring Data Redis** | RedisTemplate、缓存注解、序列化 |
| 文件上传下载 | MultipartFile、静态资源 |
| 拦截器/过滤器 | HandlerInterceptor、Filter |
| 实战项目 | RESTful 博客后端 API |

### Phase 9：Redis 详解（2 周）

| 主题 | 核心知识点 |
|------|-----------|
| Redis 是什么 | 内存数据库、KV 存储、单线程模型优势 |
| 5 种基础数据结构 | **String**（计数/缓存）、**Hash**（对象存储）、**List**（队列/时间线）、**Set**（去重/标签）、**Sorted Set**（排行榜） |
| 高级数据结构 | Bitmap（签到）、HyperLogLog（UV 统计）、Geo（附近的人） |
| 持久化机制 | **RDB**（快照）vs **AOF**（日志）、混合持久化、数据恢复 |
| 过期策略 | TTL、惰性删除 + 定期删除、**内存淘汰策略**（LRU/LFU） |
| 缓存问题 | **缓存穿透**（布隆过滤器）、**缓存击穿**（互斥锁）、**缓存雪崩**（随机过期时间） |
| 分布式锁 | `SETNX` + 过期时间、Redisson、**红锁算法** |
| Spring Boot 集成 | Spring Cache 注解（`@Cacheable`/`@CacheEvict`）、自定义序列化 |

### Phase 10：工程化能力（2 周）

| 主题 | 核心知识点 |
|------|-----------|
| Maven | pom.xml、依赖管理、生命周期、多模块 |
| Gradle 入门 | 与 Maven 对比、Groovy DSL 基础 |
| JUnit 5 | `@Test`、断言、Mockito 基础 |
| SLF4J + Logback | 日志级别、配置、MDC |
| Postman 测试 | 集合、环境变量、自动化测试 |
| Git 协作 | 分支策略、Code Review、PR 流程 |
| 代码规范 | Checkstyle、阿里巴巴 Java 规约 |
| 环境配置 | application.yml、多环境配置、环境变量 |

### Phase 11：AI 全栈衔接（2 周）

| 主题 | 核心知识点 |
|------|-----------|
| HTTP 调用 AI API | RestTemplate / OkHttp 调用 OpenAI API |
| JSON 处理 | Jackson 序列化/反序列化 |
| **SSE 流式响应** | `text/event-stream`、逐 token 展示 |
| API 密钥管理 | 环境变量、配置加密 |
| Python 入门 | 与 Java 的差异对比、`pip`/`venv` |
| Python 调用 LLM | `openai` SDK、LangChain 概念 |
| 全栈路线展望 | Node.js 角色、运维/测试路径 |
| 你的第一个 AI 应用 | Spring Boot 后端 + AI 对话接口 |

---

## 6. 学习计划与里程碑

### 6.1 阶段性里程碑

```
Week  1- 2  ██░░░░░░░░░░  前置基础完成 → 环境跑通 HelloWorld
Week  3- 4  ████░░░░░░░░  Java 语法完成 → 能写简单 CLI 计算器
Week  5- 8  ████████░░░░  OOP 完成 → 能用面向对象思维设计类
Week  9-11  ██████████░░  集合框架完成 → 能选择合适数据结构
Week 12-13  ████████████  异常&IO 完成 → 文件读写操作自如
Week 14-16  ██████████████ 并发完成 → 理解线程池，能处理并发
Week    17  █████████████  JVM 浅尝 → 了解内存结构和 GC
Week 18-19  █████████████  JDBC 完成 → 能 CRUD 操作数据库
Week 20-23  █████████████  Spring Boot 完成 → 独立开发 REST API
Week 24-25  █████████████  Redis 完成 → 掌握缓存策略+分布式锁
Week 26-27  █████████████  工程化完成 → 能测试、打包、部署
Week 28-29  █████████████  AI 衔接完成 → 能调用模型 API
```

### 6.2 每日学习建议

| 环节 | 时长 | 内容 |
|------|------|------|
| 复习回顾 | 10 min | 回顾前一天的知识点 |
| 新知识学习 | 40 min | 阅读知识点深度原理 + 代码示例 |
| 动手练习 | 30 min | 自己写代码验证、修改示例 |
| 总结笔记 | 10 min | 记录关键理解 + 疑问 |

---

## 7. 部署方案

### 7.1 Vercel 部署（推荐）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 在项目根目录执行
vercel

# 3. 按提示登录、配置
#    - Build Command: npm run build
#    - Output Directory: dist
#    - 自动检测 Vue/Vite 项目

# 之后每次 git push 自动部署
```

### 7.2 Netlify 部署（备选）

```bash
# 1. 构建项目
npm run build

# 2. 将 dist 目录拖拽到
#    https://app.netlify.com/drop

# 或通过 CLI
npx netlify-cli deploy --prod --dir=dist
```

### 7.3 构建配置

已在 `vite.config.js` 中配置：
- `base: './'` 相对路径（兼容子目录部署）
- SPA fallback（`vercel.json` / `_redirects`）
- 静态资源优化

---

## 8. 自审清单

- [x] 内容架构三层模型是否完整覆盖 Java 知识体系？
- [x] Redis 是否作为独立阶段详细编排（5 种数据结构 + 缓存策略 + 分布式锁）？
- [x] 每个知识点是否包含「浅显描述 + 深度原理 + 业务场景 + 代码示例」四要素？
- [x] 学习计划是否匹配「每天 1~2 小时」的节奏？
- [x] 是否贯穿「前端对比」帮助用户利用已有知识？
- [x] 路由设计是否简洁直观？
- [x] 状态持久化（localStorage）是否能保留学习进度？
- [x] 部署步骤是否完整可操作？
- [x] 是否存在 TBD、TODO 或模糊表述？—— 否
- [x] 各阶段之间是否有合理的依赖关系？

---

> 设计文档版本：v1.0 | 2026-04-24
> 下一步：用户审查 → writing-plans → 开始实施
