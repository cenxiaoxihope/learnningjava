// 导入各阶段的知识点数据
import { phase0Topics } from './knowledge-points/phase-0-to-3.js'
import { phase1Topics } from './knowledge-points/phase-0-to-3.js'
import { phase2Topics } from './knowledge-points/phase-0-to-3.js'
import { phase3Topics } from './knowledge-points/phase-0-to-3.js'
import { phase4Topics } from './knowledge-points/phase-4-to-7.js'
import { phase5Topics } from './knowledge-points/phase-4-to-7.js'
import { phase6Topics } from './knowledge-points/phase-4-to-7.js'
import { phase7Topics } from './knowledge-points/phase-4-to-7.js'
import { phase8Topics } from './knowledge-points/phase-8-to-11.js'
import { phase9Topics } from './knowledge-points/phase-8-to-11.js'
import { phase10Topics } from './knowledge-points/phase-8-to-11.js'
import { phase11Topics } from './knowledge-points/phase-8-to-11.js'

export const phases = [
  {
    id: 'phase-0', order: 0,
    title: '前置基础',
    subtitle: 'SQL · Linux · Git · 开发环境',
    goal: '搭建完整的 Java 开发环境，掌握 SQL 基本操作和 Linux 常用命令，为后续学习扫清障碍。',
    estimatedWeeks: 2, prerequisites: [],
    topics: phase0Topics
  },
  {
    id: 'phase-1', order: 1,
    title: 'Java 核心语法',
    subtitle: '变量 · 运算符 · 控制流 · 数组 · 方法',
    goal: '掌握 Java 的基本语法规则，能够编写简单的控制台程序。重点理解 Java 强类型系统与 JavaScript 的动态类型差异。',
    estimatedWeeks: 2, prerequisites: ['phase-0'],
    topics: phase1Topics
  },
  {
    id: 'phase-2', order: 2,
    title: '面向对象编程',
    subtitle: '封装 · 继承 · 多态 · 接口 · 抽象类',
    goal: '深入理解面向对象四大特性，能用工厂模式、策略模式等思维设计类结构，这是 Java 的核心思想。',
    estimatedWeeks: 4, prerequisites: ['phase-1'],
    topics: phase2Topics
  },
  {
    id: 'phase-3', order: 3,
    title: '核心类库与集合框架',
    subtitle: 'String · 集合 · 泛型 · Stream · 日期时间',
    goal: '熟练使用 Java 常用类库，能根据场景选择合适的数据结构（List/Set/Map），理解哈希表、红黑树等底层原理。',
    estimatedWeeks: 3, prerequisites: ['phase-2'],
    topics: phase3Topics
  },
  {
    id: 'phase-4', order: 4,
    title: '异常处理与 IO 流',
    subtitle: 'try-catch · 文件流 · 序列化 · NIO',
    goal: '掌握 Java 异常处理机制，能够进行文件读写操作，理解字节流与字符流的区别和使用场景。',
    estimatedWeeks: 2, prerequisites: ['phase-3'],
    topics: phase4Topics
  },
  {
    id: 'phase-5', order: 5,
    title: '多线程与并发编程',
    subtitle: 'Thread · 线程池 · 锁 · JUC · 并发集合',
    goal: '理解并发编程的核心概念，能使用线程池管理任务，掌握 synchronized 和 Lock 的用法，了解 JUC 工具类。',
    estimatedWeeks: 3, prerequisites: ['phase-4'],
    topics: phase5Topics
  },
  {
    id: 'phase-6', order: 6,
    title: 'JVM 原理浅尝',
    subtitle: '内存模型 · 类加载 · GC · 调优入门',
    goal: '了解 JVM 的基本架构和内存模型，理解垃圾回收机制，能进行简单的 JVM 参数调优和内存问题排查。',
    estimatedWeeks: 1, prerequisites: ['phase-5'],
    topics: phase6Topics
  },
  {
    id: 'phase-7', order: 7,
    title: '数据库编程',
    subtitle: 'JDBC · 连接池 · 事务 · MyBatis 入门',
    goal: '掌握 JDBC 核心 API，能使用 PreparedStatement 防止 SQL 注入，理解事务隔离级别，能够集成连接池。',
    estimatedWeeks: 2, prerequisites: ['phase-3', 'phase-4'],
    topics: phase7Topics
  },
  {
    id: 'phase-8', order: 8,
    title: 'Spring Boot 实战',
    subtitle: 'IoC/DI · REST API · MyBatis · JPA · Redis',
    goal: '掌握 Spring Boot 核心特性，能够独立开发 RESTful API，集成 MyBatis/JPA 进行数据访问，使用 Redis 缓存。',
    estimatedWeeks: 4, prerequisites: ['phase-2', 'phase-7'],
    topics: phase8Topics
  },
  {
    id: 'phase-9', order: 9,
    title: 'Redis 详解',
    subtitle: '数据结构 · 持久化 · 缓存策略 · 分布式锁',
    goal: '深入理解 Redis 的核心数据结构和应用场景，掌握缓存穿透/击穿/雪崩的解决方案，能实现分布式锁。',
    estimatedWeeks: 2, prerequisites: ['phase-8'],
    topics: phase9Topics
  },
  {
    id: 'phase-10', order: 10,
    title: '工程化能力',
    subtitle: 'Maven · JUnit · 日志 · Git 协作 · Docker',
    goal: '掌握 Java 项目的构建、测试、日志、版本控制等工程化技能，了解 Docker 容器化部署基础。',
    estimatedWeeks: 2, prerequisites: ['phase-8'],
    topics: phase10Topics
  },
  {
    id: 'phase-11', order: 11,
    title: 'AI 全栈衔接',
    subtitle: '调用 AI API · SSE 流式 · Python 入门 · 路线展望',
    goal: '用 Java 后端调用大模型 API，实现 SSE 流式对话；快速上手 Python 并对比 Java 差异；展望全栈学习路线。',
    estimatedWeeks: 2, prerequisites: ['phase-8'],
    topics: phase11Topics
  }
]
