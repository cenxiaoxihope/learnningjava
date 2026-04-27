// Phase 8: Spring Boot 实战 (14 topics)
// Phase 9: Redis 详解 (8 topics, EXTRA DETAIL)
// Phase 10: 工程化能力 (8 topics)
// Phase 11: AI 全栈衔接 (8 topics)

// ============================================================
// Phase 8 — Spring Boot 实战
// ============================================================
export const phase8Topics = [
  {
    id: 'spring-ioc',
    title: 'Spring 核心 IoC',
    description: '理解控制反转容器的核心思想，掌握 Bean 的创建与管理方式',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'ioc-concept',
        title: 'IoC 容器概念',
        shortDesc: 'IoC 就像一个"管家"，你不用自己 new 对象，管家帮你准备好并送到手上',
        deepPrinciple: '<p><strong>控制反转（Inversion of Control）</strong>是 Spring 的核心思想。传统编程中，对象自己负责创建和查找依赖；而 IoC 将这个"控制权"交给了容器。</p><ul><li><strong>传统方式</strong>：<code>UserService service = new UserService(new UserDao())</code>，调用者自己组装依赖</li><li><strong>IoC 方式</strong>：容器根据配置自动创建 <code>UserService</code> 并注入 <code>UserDao</code>，调用者只需声明"我需要"</li></ul><p>IoC 容器本质上是一个<strong>大型 Map</strong>，Key 是 Bean 名称/类型，Value 是 Bean 实例。启动时扫描配置 → 创建 Bean → 处理依赖 → 放入容器。</p><p>好处：<strong>解耦</strong>——组件之间不直接依赖具体实现，方便替换和测试。</p>',
        scenario: '在电商系统中，OrderService 依赖 PaymentService、InventoryService 等多个服务。如果手动 new，改一个依赖就要改所有用到它的地方。IoC 让你只需声明依赖，容器自动注入，修改实现时零改动。',
        codeExample: '// 传统方式 ——  硬编码依赖，耦合严重\npublic class OrderService {\n    private PaymentService pay = new AlipayService();\n}\n\n// IoC 方式 —— 依赖由容器注入，灵活可替换\n@Service\npublic class OrderService {\n    private final PaymentService paymentService;\n\n    public OrderService(PaymentService paymentService) {\n        this.paymentService = paymentService;\n    }\n}',
        estimatedMinutes: 30,
        tags: ['核心概念', '必学']
      },
      {
        id: 'beanfactory-vs-appctx',
        title: 'BeanFactory vs ApplicationContext',
        shortDesc: 'BeanFactory 是"毛坯房"只管创建 Bean，ApplicationContext 是"精装房"还带事件、国际化等',
        deepPrinciple: '<p><strong>BeanFactory</strong> 是 Spring 最底层接口，延迟加载（调用 getBean 时才创建）。</p><p><strong>ApplicationContext</strong> 继承 BeanFactory 并扩展了企业级功能：</p><ul><li><strong>预加载</strong>：启动时创建所有 Singleton Bean</li><li><strong>事件机制</strong>：ApplicationEventPublisher</li><li><strong>国际化</strong>：MessageSource</li><li><strong>资源加载</strong>：ResourceLoader</li><li><strong>AOP 支持</strong>：自动代理</li></ul><p>日常开发<strong>只用 ApplicationContext</strong>，常用实现有 AnnotationConfigApplicationContext（注解驱动）。</p>',
        scenario: 'Spring Boot 的 SpringApplication.run() 返回的就是 ApplicationContext。需要在非 Spring 管理的类中获取 Bean 时，可以通过它的 getBean() 方法。',
        codeExample: '// ApplicationContext — 实际使用\nApplicationContext ctx =\n    new AnnotationConfigApplicationContext(AppConfig.class);\nUserService service = ctx.getBean(UserService.class);\n\n// Spring Boot 中持有 ApplicationContext\n@Component\npublic class SpringContextHolder\n        implements ApplicationContextAware {\n    private static ApplicationContext context;\n\n    @Override\n    public void setApplicationContext(\n            ApplicationContext ctx) {\n        context = ctx;\n    }\n\n    public static <T> T getBean(Class<T> clazz) {\n        return context.getBean(clazz);\n    }\n}',
        estimatedMinutes: 25,
        tags: ['核心概念', '必学']
      },
      {
        id: 'configuration-bean',
        title: '@Configuration 与 @Bean',
        shortDesc: '@Configuration 是"菜谱本"，@Bean 是每道菜，Spring 按菜谱把菜做好放进容器',
        deepPrinciple: '<p><strong>@Configuration</strong> 标记配置类，Spring 会做 CGLIB 代理确保 @Bean 方法的单例语义。</p><p><strong>@Bean</strong> 标注在方法上，返回值注册为 Spring Bean，方法名为 Bean 名称。</p><ul><li>方法参数会被 Spring 自动注入</li><li>可指定 initMethod、destroyMethod</li></ul><p><strong>Full 模式 vs Lite 模式</strong>：@Configuration 类中的 @Bean 互调保证单例（Full）；@Component 类中的 @Bean 每次调用都 new（Lite）。</p>',
        scenario: '集成第三方库（RestTemplate、线程池等）时无法在其类上加 @Component，需要在 @Configuration 类中用 @Bean 手动注册。',
        codeExample: '@Configuration\npublic class AppConfig {\n\n    @Bean\n    public RestTemplate restTemplate() {\n        return new RestTemplate();\n    }\n\n    @Bean(name = "taskExecutor")\n    public ThreadPoolExecutor taskExecutor() {\n        return new ThreadPoolExecutor(\n            4, 8, 60, TimeUnit.SECONDS,\n            new LinkedBlockingQueue<>(1000),\n            new ThreadPoolExecutor.CallerRunsPolicy()\n        );\n    }\n\n    @Bean\n    @ConditionalOnProperty(name = "redis.host")\n    public RedisTemplate<String, Object> redisTemplate(\n            RedisConnectionFactory factory) {\n        RedisTemplate<String, Object> tpl = new RedisTemplate<>();\n        tpl.setConnectionFactory(factory);\n        return tpl;\n    }\n}',
        estimatedMinutes: 25,
        tags: ['核心概念', '必学']
      }
    ]
  },
  {
    id: 'dependency-injection',
    title: '依赖注入 DI',
    description: '掌握 Spring 三种注入方式与最佳实践',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'autowired-annotation',
        title: '@Autowired 自动装配',
        shortDesc: '@Autowired 就像快递员，你贴个标签说"我要水果"，Spring 就自动送到你家',
        deepPrinciple: '<p><strong>@Autowired</strong> 默认<strong>按类型（byType）</strong>匹配：</p><ul><li>可用在构造器、Setter、字段上</li><li>找到多个同类型 Bean 时报错（需配合 @Qualifier/@Primary）</li><li><code>required = false</code> 找不到不报错</li></ul><p>底层：<code>AutowiredAnnotationBeanPostProcessor</code> 通过反射注入。</p>',
        scenario: 'Controller 层需要调用 Service 层方法，通过 @Autowired 让 Spring 自动注入 Service 实例。',
        codeExample: '@RestController\npublic class UserController {\n\n    // 方式1：字段注入（简洁但不推荐）\n    @Autowired\n    private UserService userService;\n\n    // 方式2：构造器注入（推荐）\n    private final OrderService orderService;\n\n    public UserController(OrderService orderService) {\n        this.orderService = orderService;\n    }\n\n    // 方式3：Setter 注入（可选依赖）\n    private NotificationService notificationService;\n\n    @Autowired(required = false)\n    public void setNotificationService(\n            NotificationService ns) {\n        this.notificationService = ns;\n    }\n}',
        estimatedMinutes: 20,
        tags: ['核心概念', '必学']
      },
      {
        id: 'qualifier-primary',
        title: '@Qualifier 与 @Primary',
        shortDesc: '同类型多个 Bean 时，@Primary 是"默认首选"，@Qualifier 是"指名道姓"',
        deepPrinciple: '<p>同一接口多个实现时需要消歧义：</p><ul><li><strong>@Primary</strong>：标注在实现类上，表示"优先选我"</li><li><strong>@Qualifier("beanName")</strong>：配合 @Autowired 按名称指定</li><li>优先级：@Qualifier &gt; @Primary &gt; 按变量名匹配</li></ul>',
        scenario: '系统同时接入支付宝和微信支付，两者都实现 PaymentService 接口。默认用支付宝（@Primary），部分场景指定微信（@Qualifier）。',
        codeExample: '@Service\n@Primary\npublic class AlipayService implements PaymentService {\n    @Override\n    public void pay(BigDecimal amount) {\n        System.out.println("支付宝支付: " + amount);\n    }\n}\n\n@Service("wechatPay")\npublic class WechatPayService implements PaymentService {\n    @Override\n    public void pay(BigDecimal amount) {\n        System.out.println("微信支付: " + amount);\n    }\n}\n\n@Service\npublic class OrderService {\n    @Autowired\n    private PaymentService defaultPayment; // AlipayService\n\n    @Autowired\n    @Qualifier("wechatPay")\n    private PaymentService wechatPayment; // WechatPayService\n}',
        estimatedMinutes: 20,
        tags: ['核心概念', '必学']
      },
      {
        id: 'constructor-vs-field-injection',
        title: '构造器注入 vs 字段注入',
        shortDesc: '构造器注入像签合同时写清所有条款，字段注入像事后补充——前者更安全可靠',
        deepPrinciple: '<p><strong>构造器注入是官方推荐的最佳实践</strong>：</p><ul><li>依赖不可变（final 字段），保证线程安全</li><li>纯 Java 环境可测试：<code>new Service(mockA, mockB)</code></li><li>依赖数量一目了然</li></ul><p>字段注入的问题：无法 final、隐藏依赖数量、必须用反射测试、可能掩盖循环依赖。</p>',
        scenario: '编写单元测试时，构造器注入可以直接 new OrderService(mockPayment)；字段注入则必须启动 Spring 容器。',
        codeExample: '// 推荐：构造器注入 + Lombok\n@Service\n@RequiredArgsConstructor\npublic class OrderService {\n    private final UserService userService;\n    private final PaymentService paymentService;\n    // Lombok 自动生成全参构造器\n}\n\n// 不推荐：字段注入\n@Service\npublic class OrderService {\n    @Autowired\n    private UserService userService; // 无法 final\n    @Autowired\n    private PaymentService paymentService;\n}',
        estimatedMinutes: 20,
        tags: ['最佳实践', '必学']
      }
    ]
  },
  {
    id: 'bean-lifecycle',
    title: 'Bean 生命周期',
    description: '理解 Spring Bean 从创建到销毁的完整生命周期',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'stereotype-annotations',
        title: '@Component/@Service/@Repository/@Controller 与 @Scope',
        shortDesc: '@Component 是通用标签，其他三个是它的"职业分工"版，@Scope 控制实例化策略',
        deepPrinciple: '<p>四个组件扫描注解本质都是注册 Bean：</p><ul><li><strong>@Component</strong>：通用组件</li><li><strong>@Service</strong>：业务逻辑层</li><li><strong>@Repository</strong>：数据访问层（额外异常转换）</li><li><strong>@Controller/@RestController</strong>：Web 层</li></ul><p><strong>@Scope</strong> 控制作用域：</p><ul><li><code>singleton</code>（默认）：全局唯一</li><li><code>prototype</code>：每次 getBean 新建</li><li><code>request</code>/<code>session</code>：Web 环境专用</li></ul>',
        scenario: '项目分层架构中通过不同注解标记各层，一目了然，方便 AOP 按层切入。',
        codeExample: '@RestController\n@RequestMapping("/api/users")\npublic class UserController {\n    private final UserService userService;\n    public UserController(UserService userService) {\n        this.userService = userService;\n    }\n}\n\n@Service\npublic class UserService {\n    private final UserRepository userRepo;\n    public UserService(UserRepository userRepo) {\n        this.userRepo = userRepo;\n    }\n}\n\n@Repository\npublic class UserRepository {\n    @Autowired\n    private JdbcTemplate jdbcTemplate;\n}\n\n@Component\n@Scope("prototype")\npublic class ShoppingCart {\n    private List<CartItem> items = new ArrayList<>();\n}',
        estimatedMinutes: 25,
        tags: ['核心概念', '必学']
      },
      {
        id: 'postconstruct-predestroy',
        title: '@PostConstruct 与 @PreDestroy',
        shortDesc: '@PostConstruct 是"入职培训"在 Bean 创建后执行，@PreDestroy 是"离职交接"在销毁前执行',
        deepPrinciple: '<p>Bean 完整生命周期：<strong>实例化 → 属性注入 → @PostConstruct → 使用 → @PreDestroy → 销毁</strong></p><ul><li><strong>@PostConstruct</strong>：依赖注入完成后执行（加载缓存、校验配置）</li><li><strong>@PreDestroy</strong>：Bean 销毁前执行（关闭连接、释放资源）</li></ul><p>注意：<strong>prototype 作用域不会触发 @PreDestroy</strong>。</p>',
        scenario: '应用启动时预热缓存用 @PostConstruct；关闭时优雅释放数据库连接用 @PreDestroy。',
        codeExample: '@Service\npublic class CacheWarmUpService {\n    private final ProductRepository productRepo;\n    private Map<Long, Product> hotCache;\n\n    public CacheWarmUpService(ProductRepository productRepo) {\n        this.productRepo = productRepo;\n    }\n\n    @PostConstruct\n    public void warmUpCache() {\n        List<Product> hot = productRepo\n            .findTop100ByOrderBySalesDesc();\n        hotCache = hot.stream().collect(\n            Collectors.toMap(Product::getId,\n                Function.identity()));\n        System.out.println("缓存预热完成: "\n            + hotCache.size() + " 个商品");\n    }\n\n    @PreDestroy\n    public void saveStats() {\n        System.out.println("保存缓存统计信息...");\n    }\n}',
        estimatedMinutes: 25,
        tags: ['核心概念', '必学']
      }
    ]
  },
  {
    id: 'springboot-startup',
    title: 'Spring Boot 启动',
    description: '理解 Spring Boot 的启动机制与自动配置原理',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'springboot-application',
        title: '@SpringBootApplication 注解',
        shortDesc: '@SpringBootApplication 是三合一套餐：组件扫描 + 自动配置 + 标记配置类',
        deepPrinciple: '<p><code>@SpringBootApplication</code> 是复合注解，等价于：</p><ul><li><strong>@SpringBootConfiguration</strong>（@Configuration）：标记配置类</li><li><strong>@EnableAutoConfiguration</strong>：开启自动配置</li><li><strong>@ComponentScan</strong>：扫描当前包及子包</li></ul><p>所以启动类通常放在<strong>根包</strong>下，确保子包组件都能被扫描到。</p>',
        scenario: '创建新 Spring Boot 项目，只需一个 main 方法和此注解就能启动完整 Web 应用。',
        codeExample: 'package com.example.shop;\n\n@SpringBootApplication\npublic class ShopApplication {\n    public static void main(String[] args) {\n        SpringApplication.run(ShopApplication.class, args);\n    }\n}\n\n// 自定义排除\n@SpringBootApplication(\n    scanBasePackages = {"com.example.shop",\n                        "com.example.common"},\n    exclude = {DataSourceAutoConfiguration.class}\n)\npublic class ShopApplication { }',
        estimatedMinutes: 20,
        tags: ['核心概念', '必学']
      },
      {
        id: 'auto-configuration',
        title: '自动配置原理与启动流程',
        shortDesc: '自动配置像智能家居——检测到你买了空调（引入 jar），就自动帮你接好电线（配置 Bean）',
        deepPrinciple: '<p><strong>自动配置原理：</strong></p><ul><li>@EnableAutoConfiguration 通过 @Import 导入 AutoConfigurationImportSelector</li><li>读取 <code>META-INF/spring/...AutoConfiguration.imports</code> 中的自动配置类列表</li><li>每个配置类通过 @ConditionalOnClass、@ConditionalOnBean、@ConditionalOnProperty 等条件注解判断是否生效</li></ul><p><strong>启动流程：</strong></p><ol><li>SpringApplication.run()</li><li>创建 ApplicationContext</li><li>加载并过滤 AutoConfiguration</li><li>创建 Singleton Bean</li><li>启动内嵌 Tomcat</li><li>发布 ApplicationReadyEvent</li></ol>',
        scenario: '引入 spring-boot-starter-data-redis 后只需配置 redis.host，Spring Boot 就自动创建 RedisTemplate——约定大于配置。',
        codeExample: '// 自动配置类简化示例\n@AutoConfiguration\n@ConditionalOnClass(RedisTemplate.class)\n@EnableConfigurationProperties(RedisProperties.class)\npublic class RedisAutoConfiguration {\n\n    @Bean\n    @ConditionalOnMissingBean\n    public RedisTemplate<Object, Object> redisTemplate(\n            RedisConnectionFactory factory) {\n        RedisTemplate<Object, Object> tpl = new RedisTemplate<>();\n        tpl.setConnectionFactory(factory);\n        return tpl;\n    }\n}\n\n// application.yml\n// spring:\n//   redis:\n//     host: localhost\n//     port: 6379',
        estimatedMinutes: 30,
        tags: ['核心概念', '进阶']
      }
    ]
  },
  {
    id: 'rest-api',
    title: 'REST API 开发',
    description: '掌握 Spring Boot 中 RESTful API 的开发方式',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'rest-controller',
        title: '@RestController 注解',
        shortDesc: '@RestController = @Controller + @ResponseBody，方法返回值直接变成 JSON',
        deepPrinciple: '<p><strong>@RestController</strong> 是复合注解：</p><ul><li>@Controller：可处理 HTTP 请求</li><li>@ResponseBody：返回值直接写入响应体（自动 JSON 序列化）</li></ul><p>默认使用 Jackson 的 MappingJackson2HttpMessageConverter 将对象序列化为 JSON。</p>',
        scenario: '构建电商后台 API，所有接口返回 JSON 数据给前端。',
        codeExample: '@RestController\n@RequestMapping("/api/v1/products")\npublic class ProductController {\n    private final ProductService productService;\n\n    public ProductController(ProductService productService) {\n        this.productService = productService;\n    }\n\n    @GetMapping\n    public List<Product> listProducts() {\n        return productService.findAll();\n    }\n}',
        estimatedMinutes: 20,
        tags: ['核心概念', '必学']
      },
      {
        id: 'http-method-mappings',
        title: '@GetMapping/@PostMapping/@PutMapping/@DeleteMapping',
        shortDesc: 'GET 是"看菜单"、POST 是"点新菜"、PUT 是"换菜"、DELETE 是"退菜"',
        deepPrinciple: '<p>RESTful 风格用 HTTP 方法表示操作：</p><ul><li><strong>@GetMapping</strong>：查询（幂等、安全）</li><li><strong>@PostMapping</strong>：创建（非幂等）</li><li><strong>@PutMapping</strong>：全量更新（幂等）</li><li><strong>@DeleteMapping</strong>：删除（幂等）</li></ul><p>URL 设计原则：名词复数、HTTP 方法表动作、层级路径表关系。</p>',
        scenario: '用户管理 API：GET /users 列表，POST /users 创建，PUT /users/1 更新，DELETE /users/1 删除。',
        codeExample: '@RestController\n@RequestMapping("/api/v1/users")\npublic class UserController {\n    private final UserService userService;\n    public UserController(UserService us) { this.userService = us; }\n\n    @GetMapping\n    public List<UserVO> list() { return userService.findAll(); }\n\n    @GetMapping("/{id}")\n    public UserVO getById(@PathVariable Long id) {\n        return userService.findById(id);\n    }\n\n    @PostMapping\n    public UserVO create(@RequestBody @Valid CreateUserDTO dto) {\n        return userService.create(dto);\n    }\n\n    @PutMapping("/{id}")\n    public UserVO update(@PathVariable Long id,\n            @RequestBody @Valid UpdateUserDTO dto) {\n        return userService.update(id, dto);\n    }\n\n    @DeleteMapping("/{id}")\n    public void delete(@PathVariable Long id) {\n        userService.delete(id);\n    }\n}',
        estimatedMinutes: 25,
        tags: ['核心概念', '必学']
      },
      {
        id: 'request-mapping',
        title: '@RequestMapping 通用映射',
        shortDesc: '@RequestMapping 是所有映射注解的"祖师爷"，可配置路径、方法、请求头等全部条件',
        deepPrinciple: '<p>@RequestMapping 是最通用的请求映射注解，其他注解都是它的快捷方式。</p><p>常用属性：value/path（URL）、method（HTTP 方法）、params、headers、consumes（请求 Content-Type）、produces（响应 Content-Type）。</p><p>用在<strong>类上</strong>是公共前缀，<strong>方法上</strong>是具体路径，二者拼接。</p>',
        scenario: '所有 API 以 /api/v1 为前缀，在类上统一管理。',
        codeExample: '@RestController\n@RequestMapping(\n    path = "/api/v1/orders",\n    produces = "application/json"\n)\npublic class OrderController {\n\n    @RequestMapping(method = RequestMethod.GET,\n                    params = "status")\n    public List<Order> findByStatus(\n            @RequestParam String status) {\n        return orderService.findByStatus(status);\n    }\n\n    @GetMapping("/export/{year}/{month}")\n    public byte[] exportMonthly(\n            @PathVariable int year,\n            @PathVariable int month) {\n        return orderService.export(year, month);\n    }\n}',
        estimatedMinutes: 20,
        tags: ['核心概念', '必学']
      }
    ]
  },
  {
    id: 'request-params',
    title: '请求参数处理',
    description: '掌握各种请求参数的接收方式与校验',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'request-param-annotation',
        title: '@RequestParam 查询参数',
        shortDesc: '@RequestParam 获取 URL 中 ? 后面的参数，就像从快递单上读取收件人信息',
        deepPrinciple: '<p><code>@RequestParam</code> 用于获取 URL 查询参数和表单参数。</p><ul><li><code>required</code>：默认 true，缺少时 400</li><li><code>defaultValue</code>：默认值</li><li>支持 List（逗号分隔或重复参数名）</li></ul>',
        scenario: '商品搜索接口接收关键字、分类、价格范围等多个可选查询条件。',
        codeExample: '@GetMapping("/api/products/search")\npublic PageResult<Product> search(\n    @RequestParam String keyword,\n    @RequestParam(defaultValue = "1") int page,\n    @RequestParam(defaultValue = "20") int size,\n    @RequestParam(required = false) Long categoryId,\n    @RequestParam(required = false) BigDecimal minPrice,\n    @RequestParam(required = false) List<String> tags\n) {\n    return productService.search(\n        keyword, page, size, categoryId, minPrice, tags);\n}',
        estimatedMinutes: 20,
        tags: ['核心概念', '必学']
      },
      {
        id: 'path-variable-annotation',
        title: '@PathVariable 路径变量',
        shortDesc: '@PathVariable 从 URL 路径中提取值，就像从门牌号中读取楼层和房间号',
        deepPrinciple: '<p><code>@PathVariable</code> 获取 URL 中 <code>{}</code> 占位符的值。</p><ul><li>RESTful 风格必备</li><li>支持正则约束：<code>{id:\\\\d+}</code></li></ul>',
        scenario: 'GET /api/users/1/orders/100 查询用户 1 的订单 100。',
        codeExample: '@GetMapping("/users/{userId}/orders/{orderId}")\npublic OrderVO getUserOrder(\n    @PathVariable Long userId,\n    @PathVariable Long orderId) {\n    return orderService.findByUserAndId(userId, orderId);\n}\n\n// 正则约束\n@GetMapping("/products/{id:\\\\d+}")\npublic Product getProduct(@PathVariable Long id) {\n    return productService.findById(id);\n}',
        estimatedMinutes: 15,
        tags: ['核心概念', '必学']
      },
      {
        id: 'request-body-valid',
        title: '@RequestBody 与 @Valid 参数校验',
        shortDesc: '@RequestBody 把 JSON 变成 Java 对象，@Valid 像安检一样检查字段是否合规',
        deepPrinciple: '<p><strong>@RequestBody</strong> 将请求体 JSON 反序列化为 Java 对象。</p><p><strong>@Valid</strong> 配合 Bean Validation 注解校验：</p><ul><li>@NotNull/@NotBlank/@Size/@Min/@Max/@Email/@Pattern</li><li>校验失败抛 MethodArgumentNotValidException</li><li>@Validated 支持分组校验</li></ul>',
        scenario: '用户注册接口校验用户名长度、邮箱格式、密码强度等。',
        codeExample: 'public class CreateUserDTO {\n    @NotBlank(message = "用户名不能为空")\n    @Size(min = 2, max = 20, message = "用户名 2-20 字符")\n    private String username;\n\n    @NotBlank @Email(message = "邮箱格式不正确")\n    private String email;\n\n    @Pattern(\n        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\\\d).{8,}$",\n        message = "密码至少 8 位含大小写和数字"\n    )\n    private String password;\n}\n\n@PostMapping("/users")\npublic UserVO createUser(\n    @RequestBody @Valid CreateUserDTO dto) {\n    return userService.create(dto);\n}',
        estimatedMinutes: 30,
        tags: ['核心概念', '必学']
      }
    ]
  },
  {
    id: 'response-handling',
    title: '响应处理',
    description: '掌握统一响应格式与 HTTP 状态码',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'response-entity',
        title: 'ResponseEntity 响应实体',
        shortDesc: 'ResponseEntity 让你完全掌控 HTTP 响应——状态码、响应头、响应体全能自定义',
        deepPrinciple: '<p><code>ResponseEntity&lt;T&gt;</code> 代表完整 HTTP 响应（状态码 + 响应头 + 响应体）。</p><p>常用：<code>ResponseEntity.ok(body)</code>（200）、<code>.created(uri).body()</code>（201）、<code>.noContent().build()</code>（204）、<code>.notFound().build()</code>（404）。</p>',
        scenario: '创建资源返回 201；删除返回 204；查不到返回 404。',
        codeExample: '@PostMapping\npublic ResponseEntity<UserVO> create(\n        @RequestBody @Valid CreateUserDTO dto) {\n    UserVO user = userService.create(dto);\n    URI loc = URI.create("/api/v1/users/" + user.getId());\n    return ResponseEntity.created(loc).body(user);\n}\n\n@GetMapping("/{id}")\npublic ResponseEntity<UserVO> getById(@PathVariable Long id) {\n    return userService.findById(id)\n        .map(ResponseEntity::ok)\n        .orElse(ResponseEntity.notFound().build());\n}\n\n@DeleteMapping("/{id}")\npublic ResponseEntity<Void> delete(@PathVariable Long id) {\n    userService.delete(id);\n    return ResponseEntity.noContent().build();\n}',
        estimatedMinutes: 25,
        tags: ['核心概念', '必学']
      },
      {
        id: 'unified-result',
        title: '统一返回格式 Result 类',
        shortDesc: 'Result 是给前端的"标准信封"——固定 code/message/data 结构，前端不用猜格式',
        deepPrinciple: '<p>前后端分离项目约定统一响应格式：</p><pre><code>{ "code": 200, "message": "操作成功", "data": {...} }</code></pre><ul><li><strong>code</strong>：业务状态码</li><li><strong>message</strong>：提示信息</li><li><strong>data</strong>：实际数据</li></ul><p>前端统一判断 code 即可。</p>',
        scenario: '前端 Axios 拦截器统一判断 code，非 200 就 toast 提示 message。',
        codeExample: 'public class Result<T> {\n    private int code;\n    private String message;\n    private T data;\n\n    private Result(int code, String message, T data) {\n        this.code = code;\n        this.message = message;\n        this.data = data;\n    }\n\n    public static <T> Result<T> success(T data) {\n        return new Result<>(200, "操作成功", data);\n    }\n\n    public static <T> Result<T> success() {\n        return new Result<>(200, "操作成功", null);\n    }\n\n    public static <T> Result<T> fail(int code, String msg) {\n        return new Result<>(code, msg, null);\n    }\n    // getter/setter 省略\n}\n\n@GetMapping("/users/{id}")\npublic Result<UserVO> getUser(@PathVariable Long id) {\n    return Result.success(userService.findById(id));\n}',
        estimatedMinutes: 25,
        tags: ['最佳实践', '必学']
      }
    ]
  },
  {
    id: 'exception-handling',
    title: '异常处理',
    description: '实现全局异常处理，优雅地返回错误信息',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'controller-advice',
        title: '@ControllerAdvice 与 @ExceptionHandler',
        shortDesc: '@ControllerAdvice 是"全局异常保安"，任何 Controller 抛出的异常都会被它截获',
        deepPrinciple: '<p><strong>@RestControllerAdvice</strong> 配合 @ExceptionHandler 实现全局异常处理。</p><ul><li>可定义多个 @ExceptionHandler，按异常类型匹配（子类优先）</li><li>只能处理 Controller 层异常，Filter 中的异常需另外处理</li></ul>',
        scenario: '几十个 Controller 不用每个方法 try-catch，统一在全局处理器中转为标准格式响应。',
        codeExample: '@RestControllerAdvice\npublic class GlobalExceptionHandler {\n\n    @ExceptionHandler(MethodArgumentNotValidException.class)\n    public Result<?> handleValidation(\n            MethodArgumentNotValidException ex) {\n        String msg = ex.getBindingResult().getFieldErrors()\n            .stream()\n            .map(e -> e.getField() + ": " + e.getDefaultMessage())\n            .collect(Collectors.joining("; "));\n        return Result.fail(400, msg);\n    }\n\n    @ExceptionHandler(BusinessException.class)\n    public Result<?> handleBusiness(BusinessException ex) {\n        return Result.fail(ex.getCode(), ex.getMessage());\n    }\n\n    @ExceptionHandler(Exception.class)\n    public Result<?> handleAll(Exception ex) {\n        log.error("系统异常", ex);\n        return Result.fail(500, "服务器内部错误");\n    }\n}',
        estimatedMinutes: 25,
        tags: ['核心概念', '必学']
      },
      {
        id: 'custom-business-exception',
        title: '自定义业务异常',
        shortDesc: '自定义异常像"错误信号灯"——不同颜色代表不同问题，系统能精准响应',
        deepPrinciple: '<p>业务异常继承 RuntimeException，包含错误码和信息。</p><ul><li>用枚举管理错误码避免魔法数字</li><li>Service 层主动抛出，全局异常处理器统一捕获</li></ul>',
        scenario: '下单时库存不足、余额不够等业务异常，前端根据 code 做不同处理。',
        codeExample: 'public enum ErrorCode {\n    USER_NOT_FOUND(1001, "用户不存在"),\n    INSUFFICIENT_STOCK(2001, "库存不足"),\n    INSUFFICIENT_BALANCE(2002, "余额不足");\n\n    private final int code;\n    private final String message;\n    ErrorCode(int code, String message) {\n        this.code = code; this.message = message;\n    }\n    public int getCode() { return code; }\n    public String getMessage() { return message; }\n}\n\npublic class BusinessException extends RuntimeException {\n    private final int code;\n    public BusinessException(ErrorCode ec) {\n        super(ec.getMessage());\n        this.code = ec.getCode();\n    }\n    public int getCode() { return code; }\n}\n\n// 使用\nif (product.getStock() < quantity) {\n    throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK);\n}',
        estimatedMinutes: 25,
        tags: ['最佳实践', '必学']
      }
    ]
  },
  {
    id: 'cors-config',
    title: 'CORS 配置',
    description: '理解跨域原理并在 Spring Boot 中配置',
    estimatedHours: 1,
    knowledgePoints: [
      {
        id: 'cors-principle',
        title: '跨域原理与 @CrossOrigin',
        shortDesc: '跨域就像小区保安——前端住 A 小区（:3000），请求 B 小区（:8080），保安不认就拦了',
        deepPrinciple: '<p><strong>同源策略</strong>限制不同源（协议+域名+端口）的脚本请求。<strong>CORS</strong> 通过响应头解决：</p><ul><li><strong>简单请求</strong>：GET/POST 直接发送，检查 Access-Control-Allow-Origin</li><li><strong>预检请求</strong>：PUT/DELETE 或自定义头，先发 OPTIONS 询问</li></ul><p>关键响应头：Allow-Origin、Allow-Methods、Allow-Headers、Allow-Credentials、Max-Age</p>',
        scenario: '前端 Vue（localhost:5173）访问后端 Spring Boot（localhost:8080），端口不同产生跨域。',
        codeExample: '// 注解方式（单个 Controller）\n@CrossOrigin(origins = "http://localhost:5173")\n@RestController\npublic class UserController { }\n\n// 全局配置（推荐）\n@Configuration\npublic class CorsConfig implements WebMvcConfigurer {\n    @Override\n    public void addCorsMappings(CorsRegistry registry) {\n        registry.addMapping("/api/**")\n            .allowedOrigins("http://localhost:5173")\n            .allowedMethods("GET","POST","PUT","DELETE")\n            .allowedHeaders("*")\n            .allowCredentials(true)\n            .maxAge(3600);\n    }\n}',
        estimatedMinutes: 20,
        tags: ['核心概念', '必学']
      },
      {
        id: 'cors-global-config',
        title: 'WebMvcConfigurer 与 CorsFilter 全局配置',
        shortDesc: 'CorsFilter 在"大门口"设规则，比 WebMvcConfigurer 更早执行，与 Spring Security 更兼容',
        deepPrinciple: '<p>三种方式优先级：CorsFilter &gt; WebMvcConfigurer &gt; @CrossOrigin</p><p>Spring Security 场景推荐 CorsFilter：Filter 在 Servlet 层面，早于 Security 过滤链。</p><p>生产注意：allowCredentials=true 时不能用 * 做 origin，用 allowedOriginPatterns。</p>',
        scenario: '集成 Spring Security 后 WebMvcConfigurer 的 CORS 无效，改用 CorsFilter。',
        codeExample: '@Configuration\npublic class CorsFilterConfig {\n    @Bean\n    public CorsFilter corsFilter() {\n        CorsConfiguration config = new CorsConfiguration();\n        config.addAllowedOriginPattern("http://localhost:*");\n        config.addAllowedMethod("*");\n        config.addAllowedHeader("*");\n        config.setAllowCredentials(true);\n        config.setMaxAge(3600L);\n\n        UrlBasedCorsConfigurationSource source =\n            new UrlBasedCorsConfigurationSource();\n        source.registerCorsConfiguration("/api/**", config);\n        return new CorsFilter(source);\n    }\n}',
        estimatedMinutes: 20,
        tags: ['进阶', '实用']
      }
    ]
  },
  {
    id: 'mybatis-integration',
    title: 'MyBatis 集成',
    description: '掌握 MyBatis 在 Spring Boot 中的使用',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'mybatis-mapper',
        title: '@Mapper 接口',
        shortDesc: '@Mapper 接口就像"翻译官"——你定义 Java 方法，MyBatis 帮你翻译成 SQL 执行',
        deepPrinciple: '<p>@Mapper 标注在接口上，MyBatis 生成<strong>动态代理实现类</strong>并注册为 Bean。底层通过 JDK 动态代理 + SqlSession 执行 SQL。@MapperScan 可替代逐个加 @Mapper。</p>',
        scenario: '定义 UserMapper 接口，声明 CRUD 方法。',
        codeExample: '@Mapper\npublic interface UserMapper {\n    @Select("SELECT * FROM users WHERE id = #{id}")\n    User findById(@Param("id") Long id);\n\n    @Insert("INSERT INTO users(name, email) " +\n            "VALUES(#{name}, #{email})")\n    @Options(useGeneratedKeys = true, keyProperty = "id")\n    int insert(User user);\n\n    @Update("UPDATE users SET name=#{name} WHERE id=#{id}")\n    int update(User user);\n\n    @Delete("DELETE FROM users WHERE id = #{id}")\n    int deleteById(@Param("id") Long id);\n}',
        estimatedMinutes: 25,
        tags: ['核心概念', '必学']
      },
      {
        id: 'mybatis-annotation-sql',
        title: '@Select/@Insert 注解方式',
        shortDesc: '注解方式是"速记便签"——简单 SQL 直接写在接口上，快捷方便',
        deepPrinciple: '<p>注解方式适合简单 CRUD。@Results/@Result 处理列名映射。</p><p><strong>#{} vs ${}</strong>：#{} 预编译防注入，${} 字符串拼接（仅动态表名用）。</p>',
        scenario: '简单查询用注解 SQL 比 XML 更简洁直观。',
        codeExample: '@Mapper\npublic interface UserMapper {\n\n    @Select("SELECT id, user_name, created_at " +\n            "FROM users WHERE id = #{id}")\n    @Results({\n        @Result(property = "userName", column = "user_name"),\n        @Result(property = "createdAt", column = "created_at")\n    })\n    User findById(@Param("id") Long id);\n\n    @Select("SELECT * FROM users " +\n            "WHERE age BETWEEN #{min} AND #{max}")\n    List<User> findByAgeRange(\n        @Param("min") int min, @Param("max") int max);\n}',
        estimatedMinutes: 20,
        tags: ['核心概念', '必学']
      },
      {
        id: 'mybatis-xml-mapping',
        title: 'XML 映射文件',
        shortDesc: 'XML 映射是"详细图纸"——复杂 SQL（动态条件、多表关联）写在 XML 里更强大',
        deepPrinciple: '<p>复杂 SQL 推荐 XML：支持动态 SQL（if/choose/foreach/where/set 标签）、resultMap 嵌套映射。</p><p>文件位置：resources/mapper/XxxMapper.xml，namespace 对应 Mapper 接口全路径。</p>',
        scenario: '商品搜索根据多个可选条件动态拼接 SQL。',
        codeExample: '<!-- resources/mapper/ProductMapper.xml -->\n<mapper namespace="com.example.mapper.ProductMapper">\n\n    <select id="search" resultType="Product">\n        SELECT * FROM products\n        <where>\n            <if test="keyword != null and keyword != \'\'">\n                AND product_name LIKE\n                CONCAT(\'%\', #{keyword}, \'%\')\n            </if>\n            <if test="categoryId != null">\n                AND category_id = #{categoryId}\n            </if>\n            <if test="minPrice != null">\n                AND price &gt;= #{minPrice}\n            </if>\n        </where>\n        ORDER BY created_at DESC\n    </select>\n\n    <insert id="batchInsert">\n        INSERT INTO products(product_name, price) VALUES\n        <foreach collection="list" item="p" separator=",">\n            (#{p.productName}, #{p.price})\n        </foreach>\n    </insert>\n</mapper>',
        estimatedMinutes: 30,
        tags: ['核心概念', '必学']
      },
      {
        id: 'mybatis-pagehelper',
        title: 'PageHelper 分页插件',
        shortDesc: 'PageHelper 是"自动分页机"——你写查全部的 SQL，它自动加 LIMIT 和 COUNT',
        deepPrinciple: '<p>PageHelper 基于 MyBatis 拦截器，在 SQL 执行前自动添加 LIMIT 和 COUNT。通过 ThreadLocal 传递分页参数。</p><p><strong>注意</strong>：startPage 和查询之间不能有其他查询。</p>',
        scenario: '用户列表分页查询。',
        codeExample: '@Service\npublic class UserService {\n    private final UserMapper userMapper;\n    public UserService(UserMapper um) { this.userMapper = um; }\n\n    public PageResult<UserVO> findByPage(\n            int pageNum, int pageSize, String keyword) {\n        PageHelper.startPage(pageNum, pageSize);\n        List<User> users = userMapper.findByKeyword(keyword);\n        PageInfo<User> info = new PageInfo<>(users);\n\n        List<UserVO> voList = users.stream()\n            .map(this::toVO).collect(Collectors.toList());\n        return new PageResult<>(voList, info.getTotal(),\n            info.getPages(), pageNum, pageSize);\n    }\n}',
        estimatedMinutes: 25,
        tags: ['实用', '必学']
      }
    ]
  },
  {
    id: 'spring-data-jpa',
    title: 'Spring Data JPA',
    description: '使用 JPA 进行对象关系映射与数据访问',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'jpa-entity',
        title: '@Entity 实体映射',
        shortDesc: '@Entity 把 Java 类变成数据库表的"镜像"——类名对应表名，属性对应列名',
        deepPrinciple: '<p>JPA 是 ORM 规范，Hibernate 是最流行的实现。@Entity 标注类映射到表。常用注解：@Table、@Id、@GeneratedValue、@Column、@Transient、@Enumerated。</p>',
        scenario: '定义用户实体类映射到数据库 t_user 表。',
        codeExample: '@Entity\n@Table(name = "t_user")\npublic class User {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n    @Column(nullable = false, length = 50, unique = true)\n    private String username;\n\n    @Column(nullable = false)\n    private String email;\n\n    @Enumerated(EnumType.STRING)\n    private UserStatus status;\n\n    @Column(name = "created_at", updatable = false)\n    private LocalDateTime createdAt;\n\n    @Transient\n    private String displayName;\n\n    @PrePersist\n    public void prePersist() {\n        this.createdAt = LocalDateTime.now();\n    }\n}',
        estimatedMinutes: 25,
        tags: ['核心概念', '必学']
      },
      {
        id: 'jpa-repository',
        title: 'JpaRepository 数据访问',
        shortDesc: 'JpaRepository 是"万能助手"——继承它就自动拥有 CRUD，还能按方法名自动生成 SQL',
        deepPrinciple: '<p>继承体系：Repository → CrudRepository → PagingAndSortingRepository → JpaRepository。</p><p>方法名派生查询：findByUsername → WHERE username = ?；findByAgeBetween → WHERE age BETWEEN ? AND ?</p>',
        scenario: '用户管理模块，不写一行 SQL 就拥有完整 CRUD。',
        codeExample: 'public interface UserRepository\n        extends JpaRepository<User, Long> {\n\n    Optional<User> findByUsername(String username);\n    List<User> findByStatus(UserStatus status);\n    Page<User> findByStatus(UserStatus status, Pageable p);\n    long countByStatus(UserStatus status);\n    boolean existsByEmail(String email);\n}\n\n@Service\npublic class UserService {\n    private final UserRepository userRepo;\n    public UserService(UserRepository ur) { this.userRepo = ur; }\n\n    public Page<User> findActiveUsers(int page, int size) {\n        Pageable p = PageRequest.of(page, size,\n            Sort.by("createdAt").descending());\n        return userRepo.findByStatus(UserStatus.ACTIVE, p);\n    }\n}',
        estimatedMinutes: 25,
        tags: ['核心概念', '必学']
      },
      {
        id: 'jpa-jpql',
        title: 'JPQL 查询',
        shortDesc: 'JPQL 是面向对象版 SQL——用实体类名和属性名写查询，不用管底层表名',
        deepPrinciple: '<p>用 @Query 写 JPQL 或原生 SQL。支持命名参数 :name 和位置参数 ?1。@Modifying + @Query 执行更新/删除。nativeQuery=true 写原生 SQL。</p>',
        scenario: '复杂查询超出方法名派生能力时使用。',
        codeExample: 'public interface UserRepository\n        extends JpaRepository<User, Long> {\n\n    @Query("SELECT u FROM User u WHERE u.email " +\n           "LIKE %:keyword% OR u.username LIKE %:keyword%")\n    List<User> search(@Param("keyword") String keyword);\n\n    @Query(value = "SELECT * FROM t_user WHERE " +\n           "created_at > :since", nativeQuery = true)\n    List<User> findRecent(@Param("since") LocalDateTime since);\n\n    @Modifying\n    @Query("UPDATE User u SET u.status = :status " +\n           "WHERE u.id = :id")\n    int updateStatus(@Param("id") Long id,\n                     @Param("status") UserStatus status);\n}',
        estimatedMinutes: 25,
        tags: ['核心概念', '必学']
      },
      {
        id: 'jpa-auditing',
        title: '审计 @CreatedDate',
        shortDesc: '@CreatedDate 和 @LastModifiedDate 是"自动填表机"——创建和修改时间自动记录',
        deepPrinciple: '<p>@EnableJpaAuditing + @EntityListeners(AuditingEntityListener.class) 启用。</p><ul><li>@CreatedDate：创建时间</li><li>@LastModifiedDate：修改时间</li><li>@CreatedBy/@LastModifiedBy：需实现 AuditorAware</li></ul>',
        scenario: '每条记录自动记录创建/更新时间用于审计。',
        codeExample: '@Configuration\n@EnableJpaAuditing\npublic class JpaConfig {\n    @Bean\n    public AuditorAware<String> auditorProvider() {\n        return () -> Optional.ofNullable(\n            SecurityContextHolder.getContext()\n                .getAuthentication())\n            .map(Authentication::getName);\n    }\n}\n\n@MappedSuperclass\n@EntityListeners(AuditingEntityListener.class)\npublic abstract class BaseEntity {\n    @CreatedDate\n    @Column(updatable = false)\n    private LocalDateTime createdAt;\n\n    @LastModifiedDate\n    private LocalDateTime updatedAt;\n\n    @CreatedBy\n    @Column(updatable = false)\n    private String createdBy;\n}\n\n@Entity\npublic class Product extends BaseEntity {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private String name;\n}',
        estimatedMinutes: 25,
        tags: ['实用', '推荐']
      }
    ]
  },
  {
    id: 'spring-data-redis',
    title: 'Spring Data Redis 基础',
    description: '在 Spring Boot 中集成 Redis 进行缓存操作',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'redis-template',
        title: 'RedisTemplate 与 StringRedisTemplate',
        shortDesc: 'RedisTemplate 是操作 Redis 的"万能遥控器"，支持所有数据结构',
        deepPrinciple: '<p>RedisTemplate 封装了 Redis 所有操作：opsForValue()、opsForHash()、opsForList()、opsForSet()、opsForZSet()。</p><p>StringRedisTemplate 是 String 特化版，省去序列化烦恼。默认 JDK 序列化有乱码，推荐自定义。</p>',
        scenario: '电商系统缓存商品详情加速查询。',
        codeExample: '@Service\npublic class ProductCacheService {\n    private final StringRedisTemplate stringRedis;\n\n    public ProductCacheService(StringRedisTemplate sr) {\n        this.stringRedis = sr;\n    }\n\n    public void cache(Long id, String json) {\n        stringRedis.opsForValue()\n            .set("product:" + id, json, 30, TimeUnit.MINUTES);\n    }\n\n    public String get(Long id) {\n        return stringRedis.opsForValue().get("product:" + id);\n    }\n\n    public void addToCart(Long userId, Long prodId, int qty) {\n        stringRedis.opsForHash()\n            .put("cart:" + userId, prodId.toString(),\n                 String.valueOf(qty));\n    }\n}',
        estimatedMinutes: 25,
        tags: ['核心概念', '必学']
      },
      {
        id: 'cacheable-annotation',
        title: '@Cacheable 缓存注解',
        shortDesc: '@Cacheable 是"智能备忘录"——第一次查数据库并记住，之后直接返回缓存',
        deepPrinciple: '<p>Spring Cache 声明式注解：@Cacheable（查缓存/写缓存）、@CachePut（更新缓存）、@CacheEvict（删除缓存）、@Caching（组合）。</p><p>key 支持 SpEL：<code>#id</code>、<code>#user.id</code>。需 @EnableCaching。</p>',
        scenario: '用户信息高频查询低频更新，@Cacheable 加速。',
        codeExample: '@EnableCaching\n@Configuration\npublic class CacheConfig { }\n\n@Service\npublic class UserService {\n    @Cacheable(value = "users", key = "#id",\n               unless = "#result == null")\n    public User findById(Long id) {\n        return userRepo.findById(id).orElse(null);\n    }\n\n    @CachePut(value = "users", key = "#user.id")\n    public User update(User user) {\n        return userRepo.save(user);\n    }\n\n    @CacheEvict(value = "users", key = "#id")\n    public void delete(Long id) {\n        userRepo.deleteById(id);\n    }\n}',
        estimatedMinutes: 25,
        tags: ['核心概念', '必学']
      },
      {
        id: 'redis-serialization',
        title: '序列化配置',
        shortDesc: '序列化决定数据存 Redis 的"格式"——选错全是乱码，选对可读又高效',
        deepPrinciple: '<p>默认 JDK 序列化不可读。推荐：Key 用 StringRedisSerializer，Value 用 GenericJackson2JsonRedisSerializer（JSON 可读，自带类型信息）。</p>',
        scenario: '运维需要在 Redis 客户端直接查看缓存数据。',
        codeExample: '@Configuration\npublic class RedisConfig {\n    @Bean\n    public RedisTemplate<String, Object> redisTemplate(\n            RedisConnectionFactory factory) {\n        RedisTemplate<String, Object> tpl = new RedisTemplate<>();\n        tpl.setConnectionFactory(factory);\n\n        StringRedisSerializer strSer = new StringRedisSerializer();\n        GenericJackson2JsonRedisSerializer jsonSer =\n            new GenericJackson2JsonRedisSerializer();\n\n        tpl.setKeySerializer(strSer);\n        tpl.setHashKeySerializer(strSer);\n        tpl.setValueSerializer(jsonSer);\n        tpl.setHashValueSerializer(jsonSer);\n        tpl.afterPropertiesSet();\n        return tpl;\n    }\n\n    @Bean\n    public CacheManager cacheManager(RedisConnectionFactory f) {\n        RedisCacheConfiguration cfg = RedisCacheConfiguration\n            .defaultCacheConfig()\n            .entryTtl(Duration.ofMinutes(30))\n            .serializeKeysWith(SerializationPair.fromSerializer(\n                new StringRedisSerializer()))\n            .serializeValuesWith(SerializationPair.fromSerializer(\n                new GenericJackson2JsonRedisSerializer()))\n            .disableCachingNullValues();\n        return RedisCacheManager.builder(f)\n            .cacheDefaults(cfg).build();\n    }\n}',
        estimatedMinutes: 25,
        tags: ['配置', '必学']
      }
    ]
  },
  {
    id: 'file-upload-download',
    title: '文件上传下载',
    description: '实现文件上传、存储与下载功能',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'multipart-file',
        title: 'MultipartFile 文件上传',
        shortDesc: 'MultipartFile 是接收上传文件的"快递箱"——文件名、大小、内容全在里面',
        deepPrinciple: '<p>MultipartFile 包含：getOriginalFilename()、getSize()、getContentType()、transferTo(File)。</p><p>安全注意：校验文件类型、重命名（UUID）防路径穿越、限制大小。</p>',
        scenario: '用户上传头像，校验格式和大小后保存到服务器。',
        codeExample: '@PostMapping("/api/files/upload")\npublic Result<String> upload(\n        @RequestParam("file") MultipartFile file)\n        throws IOException {\n    if (file.isEmpty())\n        return Result.fail(400, "文件不能为空");\n\n    Set<String> allowed = Set.of("image/jpeg", "image/png");\n    if (!allowed.contains(file.getContentType()))\n        return Result.fail(400, "只支持 JPG/PNG");\n\n    String ext = StringUtils.getFilenameExtension(\n        file.getOriginalFilename());\n    String name = UUID.randomUUID() + "." + ext;\n\n    Path target = Paths.get(uploadDir, name);\n    Files.createDirectories(target.getParent());\n    file.transferTo(target.toFile());\n\n    return Result.success("/files/" + name);\n}',
        estimatedMinutes: 25,
        tags: ['实用', '必学']
      },
      {
        id: 'static-resource-config',
        title: '静态资源配置与文件存储路径',
        shortDesc: '静态资源配置给服务器开一扇"展示窗"——指定路径的文件可通过 URL 直接访问',
        deepPrinciple: '<p>默认静态资源：classpath:/static/。自定义映射：WebMvcConfigurer.addResourceHandlers。文件下载设置 Content-Disposition: attachment。</p>',
        scenario: '上传的文件需要通过 URL 直接访问。',
        codeExample: '@Configuration\npublic class WebConfig implements WebMvcConfigurer {\n    @Value("${file.upload-dir:./uploads}")\n    private String uploadDir;\n\n    @Override\n    public void addResourceHandlers(\n            ResourceHandlerRegistry registry) {\n        registry.addResourceHandler("/files/**")\n            .addResourceLocations("file:" + uploadDir + "/")\n            .setCachePeriod(3600);\n    }\n}\n\n@GetMapping("/download/{name}")\npublic ResponseEntity<Resource> download(\n        @PathVariable String name) throws Exception {\n    Path path = Paths.get(uploadDir, name);\n    Resource res = new UrlResource(path.toUri());\n    if (!res.exists())\n        return ResponseEntity.notFound().build();\n    return ResponseEntity.ok()\n        .contentType(MediaType.APPLICATION_OCTET_STREAM)\n        .header("Content-Disposition",\n            "attachment; filename=\\"" + name + "\\"")\n        .body(res);\n}',
        estimatedMinutes: 25,
        tags: ['实用', '必学']
      }
    ]
  },
  {
    id: 'interceptor-filter',
    title: '拦截器与过滤器',
    description: '理解 Filter 和 Interceptor 的区别与使用场景',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'handler-interceptor',
        title: 'HandlerInterceptor 与登录拦截示例',
        shortDesc: '拦截器像"门禁系统"——进来时验身份，处理完后记日志',
        deepPrinciple: '<p>HandlerInterceptor 三个方法：preHandle（Controller 前，return false 拦截）、postHandle（Controller 后）、afterCompletion（请求完成后清理资源）。</p><p>通过 WebMvcConfigurer.addInterceptors 注册，配置拦截/排除路径。</p>',
        scenario: '未登录用户访问认证接口返回 401，放行登录/注册等公开接口。',
        codeExample: 'public class LoginInterceptor\n        implements HandlerInterceptor {\n    @Override\n    public boolean preHandle(HttpServletRequest req,\n            HttpServletResponse resp, Object handler)\n            throws Exception {\n        String token = req.getHeader("Authorization");\n        if (token == null || !token.startsWith("Bearer ")) {\n            resp.setStatus(401);\n            resp.setContentType("application/json");\n            resp.getWriter().write(\n                "{\\"code\\":401,\\"message\\":\\"请先登录\\"}");\n            return false;\n        }\n        Long userId = JwtUtils.parseUserId(token.substring(7));\n        req.setAttribute("currentUserId", userId);\n        return true;\n    }\n}\n\n@Configuration\npublic class WebConfig implements WebMvcConfigurer {\n    @Override\n    public void addInterceptors(InterceptorRegistry reg) {\n        reg.addInterceptor(new LoginInterceptor())\n            .addPathPatterns("/api/**")\n            .excludePathPatterns("/api/auth/**");\n    }\n}',
        estimatedMinutes: 30,
        tags: ['核心概念', '必学']
      },
      {
        id: 'filter-vs-interceptor',
        title: 'Filter vs Interceptor 执行顺序',
        shortDesc: 'Filter 在"院子大门"过滤所有来客，Interceptor 在"楼道门口"只管 Spring MVC 请求',
        deepPrinciple: '<p>Filter（Servlet 规范）作用于所有请求；Interceptor（Spring MVC）只作用于 Controller 请求。</p><p>执行流程：Filter → DispatcherServlet → Interceptor.preHandle → Controller → postHandle → afterCompletion → Filter。</p><p>多个 Filter 按 @Order 排序，多个 Interceptor 按注册顺序执行。</p>',
        scenario: '字符编码用 Filter（所有请求）；登录校验用 Interceptor（只管 API）。',
        codeExample: '@Component\n@Order(1)\npublic class RequestLogFilter implements Filter {\n    @Override\n    public void doFilter(ServletRequest request,\n            ServletResponse response, FilterChain chain)\n            throws IOException, ServletException {\n        HttpServletRequest req = (HttpServletRequest) request;\n        long start = System.currentTimeMillis();\n\n        chain.doFilter(request, response);\n\n        long cost = System.currentTimeMillis() - start;\n        HttpServletResponse resp =\n            (HttpServletResponse) response;\n        System.out.printf("[%d] %s %s - %dms%n",\n            resp.getStatus(), req.getMethod(),\n            req.getRequestURI(), cost);\n    }\n}',
        estimatedMinutes: 25,
        tags: ['核心概念', '必学']
      }
    ]
  }
];

// ============================================================
// Phase 9 — Redis 详解 (EXTRA DETAIL)
// ============================================================
export const phase9Topics = [
  {
    id: 'redis-intro',
    title: 'Redis 是什么',
    description: '深入理解 Redis 的核心特性、内部架构与高性能原因',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'redis-overview',
        title: '内存数据库与 KV 存储',
        shortDesc: 'Redis 就像超大号"内存字典"——数据全放内存里，查找速度比磁盘数据库快千倍',
        deepPrinciple: '<p><strong>Redis（Remote Dictionary Server）</strong>是开源的基于内存的键值存储数据库。</p><p><strong>核心特性：</strong></p><ul><li><strong>内存存储</strong>：内存访问 ~100ns，SSD ~100us，差 1000 倍。所有数据在内存中，无磁盘 I/O 延迟</li><li><strong>键值模型</strong>：Key 是字符串（最大 512MB），Value 支持多种数据结构</li><li><strong>丰富数据结构</strong>：String、Hash、List、Set、Sorted Set、Bitmap、HyperLogLog、Geo、Stream</li><li><strong>持久化</strong>：RDB 快照 + AOF 日志，防止数据丢失</li><li><strong>单线程命令执行</strong>：避免锁竞争和上下文切换</li><li><strong>高可用</strong>：主从复制、Sentinel 哨兵、Cluster 集群</li></ul><p><strong>Redis 底层数据模型</strong>：使用全局哈希表（dictht）存储 KV。每个 Key 是 SDS（Simple Dynamic String），Value 是 redisObject 结构（含 type、encoding、ptr）。Redis 根据数据大小自动选择最节省内存的编码方式（如小 Hash 用 ziplist/listpack，大 Hash 用 hashtable）。</p><p><strong>vs MySQL</strong>：Redis 适合高频读写和临时数据；MySQL 适合持久化和复杂查询。<br/><strong>vs Memcached</strong>：Redis 数据结构更丰富、支持持久化和集群、支持 Lua 脚本。</p>',
        scenario: '电商大促，商品详情页每秒上万次访问。MySQL 单机 QPS ~5000 扛不住。热门商品缓存到 Redis（QPS 10万+），数据库压力降低 90%。',
        codeExample: '// Redis 基本命令（redis-cli）\n\n// String 缓存\nSET user:1001 "{\\"name\\":\\"张三\\"}" EX 1800\nGET user:1001\n\n// Hash 存商品\nHSET product:2001 name "iPhone" price 5999 stock 100\nHGETALL product:2001\n\n// List 最新消息\nLPUSH news:latest "头条1" "头条2"\nLRANGE news:latest 0 9\n\n// Set 用户标签\nSADD user:1001:tags "Java" "Redis"\nSMEMBERS user:1001:tags\n\n// Sorted Set 排行榜\nZADD leaderboard 99 "玩家A" 87 "玩家B"\nZREVRANGE leaderboard 0 2 WITHSCORES\n\n// 基本操作\nTYPE user:1001   // string\nTTL user:1001    // 剩余秒数\nEXISTS user:1001 // 1 or 0\nDEL user:1001',
        estimatedMinutes: 30,
        tags: ['核心概念', '必学']
      },
      {
        id: 'redis-single-thread',
        title: '单线程模型与 6.0 IO 多线程',
        shortDesc: 'Redis 单线程就像一个超快收银员——一个人处理所有订单，因为动作极快所以不用排队',
        deepPrinciple: '<p><strong>"单线程"指命令执行（核心逻辑）在单线程完成</strong>，并非整个进程只有一个线程（后台有 bio 线程处理关闭文件、AOF fsync、释放内存等）。</p><p><strong>单线程为什么快？</strong></p><ul><li><strong>纯内存操作</strong>：瓶颈不在 CPU 而在网络 I/O</li><li><strong>避免锁竞争</strong>：无需加锁/解锁，无死锁风险</li><li><strong>避免上下文切换</strong>：多线程切换本身有 CPU 开销</li><li><strong>I/O 多路复用（epoll/kqueue）</strong>：单线程同时监听数千连接，哪个有数据就处理哪个</li></ul><p><strong>I/O 多路复用细节</strong>：Redis 的 ae event loop 底层调用 epoll_wait，将所有客户端 socket 注册到内核。内核通知哪些 socket 可读/可写，Redis 再逐一处理。一个线程管理上万连接。</p><p><strong>Redis 6.0 IO 多线程：</strong></p><ul><li>网络请求的<strong>读取/解析</strong>和<strong>响应写回</strong>可由多个 IO 线程并行</li><li><strong>命令执行仍然单线程</strong>，保证原子性</li><li>默认关闭，配置 <code>io-threads 4</code> + <code>io-threads-do-reads yes</code> 开启</li><li>可提升 50%-100% 网络吞吐</li></ul><p><strong>Redis 7.0 进一步优化</strong>：引入多线程 IO 优化，更智能的内存管理，以及 Function（替代 EVAL）等新特性。</p>',
        scenario: 'Redis 单机可达 10万+ QPS。即使秒杀场景，单线程也能轻松应对。如果网络吞吐成为瓶颈，可开启 6.0 IO 多线程。',
        codeExample: '// Redis 6.0+ 多线程配置（redis.conf）\n// io-threads 4\n// io-threads-do-reads yes\n\n// 性能测试\n// redis-benchmark -h 127.0.0.1 -p 6379 -c 100 -n 100000\n\n// Java Lettuce 连接配置\n@Bean\npublic LettuceConnectionFactory redisConnectionFactory() {\n    RedisStandaloneConfiguration config =\n        new RedisStandaloneConfiguration("localhost", 6379);\n\n    // Lettuce 使用 Netty NIO，单连接即可\n    // 高并发可配置连接池\n    GenericObjectPoolConfig<?> poolConfig =\n        new GenericObjectPoolConfig<>();\n    poolConfig.setMaxTotal(8);\n    poolConfig.setMaxIdle(8);\n    poolConfig.setMinIdle(2);\n\n    LettucePoolingClientConfiguration clientConfig =\n        LettucePoolingClientConfiguration.builder()\n            .poolConfig(poolConfig).build();\n\n    return new LettuceConnectionFactory(config, clientConfig);\n}',
        estimatedMinutes: 35,
        tags: ['核心概念', '必学']
      },
      {
        id: 'redis-why-fast',
        title: '为什么 Redis 这么快',
        shortDesc: '内存 + 单线程 + IO 多路复用 + 高效数据结构 = 四大速度引擎',
        deepPrinciple: '<p><strong>Redis 高性能四大原因：</strong></p><ol><li><strong>纯内存操作</strong>：内存 ~100ns vs SSD ~100us（1000 倍差距）。即使有 RDB/AOF 持久化，也是异步/后台进行</li><li><strong>单线程模型</strong>：无锁竞争、无上下文切换、命令天然原子性</li><li><strong>I/O 多路复用</strong>：epoll 事件驱动，一个线程管理上万连接</li><li><strong>高效底层数据结构</strong>：<ul><li><strong>SDS</strong>：O(1) 获取长度，预分配空间减少 realloc</li><li><strong>跳表（Skip List）</strong>：Sorted Set 底层，O(logN) 查找，比红黑树实现更简单</li><li><strong>ziplist/listpack</strong>：小数据用连续内存，减少碎片和指针开销</li><li><strong>intset</strong>：全整数小集合用紧凑数组</li><li><strong>dict</strong>：渐进式 rehash，扩容不阻塞</li></ul></li></ol><p><strong>性能参考</strong>：简单命令 10万+ QPS，Pipeline 批量 50万+ QPS，延迟通常 &lt;1ms。</p><p><strong>渐进式 rehash 详解</strong>：当哈希表负载因子超阈值时，Redis 不会一次性迁移所有数据（会阻塞），而是在每次读写操作时顺带迁移一小部分（ht[0] → ht[1]），分摊到多次操作中完成，保证服务不中断。</p>',
        scenario: '面试高频题"Redis 为什么快"，需从内存、单线程、IO 多路复用、数据结构四个维度回答。',
        codeExample: '// Pipeline 批量操作 — 性能对比\n\n// 1. 逐条执行（10000 次网络往返）\nfor (int i = 0; i < 10000; i++) {\n    stringRedis.opsForValue().set("k:" + i, "v:" + i);\n}\n// 耗时约 2000ms\n\n// 2. Pipeline 批量（1 次网络往返）\nstringRedis.executePipelined((RedisCallback<Object>) conn -> {\n    for (int i = 0; i < 10000; i++) {\n        conn.stringCommands().set(\n            ("k:" + i).getBytes(), ("v:" + i).getBytes());\n    }\n    return null;\n});\n// 耗时约 50ms — 快 40 倍！\n\n// 3. Lua 脚本 — 原子性批量操作\nString script = "for i=1,ARGV[1] do " +\n    "redis.call(\'SET\', KEYS[1]..i, ARGV[2]..i) end";\nstringRedis.execute(new DefaultRedisScript<>(script, Void.class),\n    List.of("prefix:"), "10000", "value:");',
        estimatedMinutes: 30,
        tags: ['核心概念', '面试重点']
      }
    ]
  },
  {
    id: 'redis-data-structures',
    title: '5 种基础数据结构详解',
    description: '深入掌握 Redis 五种基础数据结构的原理、底层编码与应用场景',
    estimatedHours: 4,
    knowledgePoints: [
      {
        id: 'redis-string',
        title: 'String（计数/缓存/分布式锁）',
        shortDesc: 'String 是 Redis 最基础的类型，像一个"万能抽屉"——能存字符串、数字、甚至图片二进制',
        deepPrinciple: '<p><strong>String</strong> 是 Redis 最基础的数据类型，最大 512MB。</p><p><strong>底层编码</strong>（Redis 自动选择最优编码）：</p><ul><li><strong>int</strong>：值为整数且 &lt;= 2^63-1 时，直接存在 redisObject 的 ptr 指针中（8字节），零额外开销</li><li><strong>embstr</strong>：字符串长度 &lt;= 44 字节时，redisObject 和 SDS 在<strong>一次内存分配</strong>中连续存储，CPU 缓存友好</li><li><strong>raw</strong>：字符串 &gt; 44 字节，redisObject 和 SDS 分两次分配，灵活但多一次内存分配</li></ul><p><strong>SDS（Simple Dynamic String）结构</strong>：包含 len（已用长度）、alloc（已分配总长度）、flags（类型标记）、buf[]（实际字符数组）。相比 C 字符串优点：O(1) 获取长度、二进制安全、自动扩容时预分配（&lt;1MB 翻倍，&gt;=1MB 加 1MB）。</p><p><strong>核心命令</strong>：SET/GET/MSET/MGET（批量）、INCR/DECR/INCRBY（原子计数）、SETNX（不存在才设置，用于分布式锁）、SETEX/PSETEX（设置过期时间）、APPEND（追加）、STRLEN（长度）。</p>',
        scenario: '1. 缓存：SET user:1001 "{json}" EX 3600\n2. 计数器：INCR article:1001:views（文章阅读量，原子操作无需加锁）\n3. 分布式锁：SET lock:order SETNX EX 10\n4. 限流：INCR rate:ip:xxx + EXPIRE（1 秒内请求计数）',
        codeExample: '// 缓存场景\nstringRedis.opsForValue().set("user:1001",\n    userJson, 30, TimeUnit.MINUTES);\nString cached = stringRedis.opsForValue().get("user:1001");\n\n// 原子计数（线程安全）\nLong views = stringRedis.opsForValue()\n    .increment("article:1001:views");\n\n// 分布式锁（简化版）\nBoolean locked = stringRedis.opsForValue()\n    .setIfAbsent("lock:order:123", "owner-1",\n        10, TimeUnit.SECONDS);\nif (Boolean.TRUE.equals(locked)) {\n    try {\n        // 执行业务\n    } finally {\n        stringRedis.delete("lock:order:123");\n    }\n}\n\n// 批量操作\nMap<String, String> map = Map.of(\n    "config:a", "1", "config:b", "2");\nstringRedis.opsForValue().multiSet(map);\nList<String> vals = stringRedis.opsForValue()\n    .multiGet(List.of("config:a", "config:b"));',
        estimatedMinutes: 35,
        tags: ['核心数据结构', '必学']
      },
      {
        id: 'redis-hash',
        title: 'Hash（对象存储/购物车）',
        shortDesc: 'Hash 就像一个"表格"——一个 Key 下存多个字段和值，天然适合存储对象属性',
        deepPrinciple: '<p><strong>Hash</strong> 是键值对集合，一个 Key 对应多个 field-value。</p><p><strong>底层编码</strong>：</p><ul><li><strong>listpack</strong>（Redis 7.0+，替代 ziplist）：当元素个数 &lt;= hash-max-listpack-entries（默认 128）且每个值大小 &lt;= hash-max-listpack-value（默认 64 字节）时使用。连续内存，紧凑高效，适合小 Hash</li><li><strong>hashtable</strong>：超过阈值时转为哈希表，O(1) 查找，适合大 Hash</li></ul><p><strong>listpack 结构</strong>：连续内存块，每个 entry 包含前一个 entry 长度 + 编码 + 数据。遍历是 O(N) 但因为连续内存有 CPU 缓存优势，小数据量比 hashtable 更快。</p><p><strong>核心命令</strong>：HSET/HGET/HMSET/HMGET/HGETALL/HDEL/HEXISTS/HKEYS/HVALS/HLEN/HINCRBY</p><p><strong>Hash vs String 存对象</strong>：Hash 可以只更新单个字段（HSET user:1 age 29），String 必须整体覆盖。但 Hash 不支持单独给 field 设过期时间。</p>',
        scenario: '1. 用户信息：HSET user:1001 name "张三" age 28 email "z@x.com"（可以只更新 age 不影响其他字段）\n2. 购物车：HSET cart:uid productId quantity（每个用户一个 Hash，field 是商品 ID，value 是数量）\n3. 对象缓存：比 JSON 字符串更灵活，支持部分更新',
        codeExample: '// 存储用户信息\nHashOperations<String, String, Object> hash =\n    redisTemplate.opsForHash();\nhash.put("user:1001", "name", "张三");\nhash.put("user:1001", "age", 28);\nhash.put("user:1001", "email", "z@x.com");\n\n// 获取单个字段\nString name = (String) hash.get("user:1001", "name");\n\n// 获取所有字段\nMap<String, Object> user = hash.entries("user:1001");\n\n// 购物车操作\npublic void addToCart(Long uid, Long prodId, int qty) {\n    String key = "cart:" + uid;\n    hash.put(key, prodId.toString(), qty);\n}\n\npublic void removeFromCart(Long uid, Long prodId) {\n    hash.delete("cart:" + uid, prodId.toString());\n}\n\npublic Map<String, Object> getCart(Long uid) {\n    return hash.entries("cart:" + uid);\n}\n\n// 字段自增（修改购物车数量）\nhash.increment("cart:1001", "2001", 1);',
        estimatedMinutes: 30,
        tags: ['核心数据结构', '必学']
      },
      {
        id: 'redis-list',
        title: 'List（消息队列/最新列表）',
        shortDesc: 'List 是有序"链表"——可以从头尾两端操作，天然适合做队列和最新列表',
        deepPrinciple: '<p><strong>List</strong> 是有序字符串列表，按插入顺序排列。</p><p><strong>底层编码</strong>：</p><ul><li><strong>listpack</strong>（小数据量）：连续内存，紧凑高效</li><li><strong>quicklist</strong>（大数据量）：双向链表，每个节点是一个 listpack。兼顾链表的快速头尾插入和连续内存的缓存友好性</li></ul><p><strong>quicklist 结构详解</strong>：类似"链表套数组"。每个节点（quicklistNode）包含一个 listpack，还可以配置 list-compress-depth 对中间节点进行 LZF 压缩，减少内存占用。</p><p><strong>核心命令</strong>：</p><ul><li>LPUSH/RPUSH（左/右插入）、LPOP/RPOP（左/右弹出）</li><li>LRANGE（范围查询）、LLEN（长度）、LINDEX（索引访问）</li><li>BLPOP/BRPOP（阻塞弹出，超时等待）— 用于消息队列</li><li>LREM（删除指定元素）、LTRIM（裁剪，只保留范围内元素）</li></ul>',
        scenario: '1. 消息队列：LPUSH + BRPOP 实现简单的生产者-消费者模式\n2. 最新列表：LPUSH + LTRIM 维护最新 N 条记录（如最新文章、最近播放）\n3. 时间线：微博 timeline 按时间顺序存储',
        codeExample: '// 最新文章列表\nListOperations<String, String> list =\n    stringRedis.opsForList();\n\n// 新文章加入列表头部\nlist.leftPush("articles:latest", articleId);\n// 只保留最新 100 条\nstringRedis.opsForList().trim("articles:latest", 0, 99);\n// 获取最新 10 条\nList<String> latest = list.range("articles:latest", 0, 9);\n\n// 简单消息队列\n// 生产者\nlist.leftPush("queue:orders", orderJson);\n\n// 消费者（阻塞等待，30 秒超时）\nString order = list.rightPop(\n    "queue:orders", 30, TimeUnit.SECONDS);\nif (order != null) {\n    processOrder(order);\n}\n\n// 栈（FILO）\nlist.leftPush("stack", "a");\nlist.leftPush("stack", "b");\nlist.leftPop("stack"); // "b"',
        estimatedMinutes: 30,
        tags: ['核心数据结构', '必学']
      },
      {
        id: 'redis-set',
        title: 'Set（标签/共同好友）',
        shortDesc: 'Set 是"无序去重集合"——自动去重 + 支持交集/并集/差集运算，天然适合社交关系',
        deepPrinciple: '<p><strong>Set</strong> 是无序、不重复的字符串集合。</p><p><strong>底层编码</strong>：</p><ul><li><strong>intset</strong>：所有元素都是整数且数量 &lt;= set-max-intset-entries（默认 512）时使用。紧凑数组，有序存储，二分查找 O(logN)</li><li><strong>hashtable</strong>：超出阈值或有非整数元素时转为哈希表，O(1) 查找</li></ul><p><strong>intset 优化</strong>：根据最大整数值自动选择 int16/int32/int64 编码，最大限度节省内存。升级时（如插入超过 int16 范围的值）会自动从 int16 扩展到 int32。</p><p><strong>核心命令</strong>：SADD/SREM/SISMEMBER/SMEMBERS/SCARD（元素数）/SRANDMEMBER（随机元素）/SPOP（随机弹出）/SINTER（交集）/SUNION（并集）/SDIFF（差集）</p>',
        scenario: '1. 共同好友：SINTER user:A:friends user:B:friends\n2. 用户标签：SADD user:1001:tags "Java" "Redis"\n3. 抽奖：SRANDMEMBER/SPOP 随机选中\n4. 点赞去重：SADD likes:post:1 userId（不会重复点赞）',
        codeExample: 'SetOperations<String, String> set =\n    stringRedis.opsForSet();\n\n// 用户标签\nset.add("user:1001:tags", "Java", "Redis", "Spring");\nset.add("user:1002:tags", "Java", "Python", "Redis");\n\n// 共同标签（交集）\nSet<String> common = set.intersect(\n    "user:1001:tags", "user:1002:tags");\n// [Java, Redis]\n\n// 点赞（去重）\nset.add("likes:post:1001", "user:2001");\nset.add("likes:post:1001", "user:2001"); // 重复无效\nLong likeCount = set.size("likes:post:1001");\nBoolean liked = set.isMember("likes:post:1001", "user:2001");\n\n// 抽奖\n// 随机 3 个（不移除）\nList<String> winners = set.randomMembers("lottery", 3);\n// 随机弹出 1 个（移除，防重复中奖）\nString winner = set.pop("lottery");',
        estimatedMinutes: 30,
        tags: ['核心数据结构', '必学']
      },
      {
        id: 'redis-sorted-set',
        title: 'Sorted Set（排行榜/延迟队列）',
        shortDesc: 'Sorted Set 是"自动排序的集合"——每个元素有分数，按分数排名，天生就是排行榜',
        deepPrinciple: '<p><strong>Sorted Set（ZSet）</strong>每个元素关联一个 score（double），按 score 从小到大排序。</p><p><strong>底层编码</strong>：</p><ul><li><strong>listpack</strong>：元素数 &lt;= zset-max-listpack-entries（128）且大小 &lt;= zset-max-listpack-value（64B）</li><li><strong>skiplist + hashtable</strong>：超出阈值时使用跳表（按 score 排序，支持范围查询）+ 哈希表（按 member 查 score，O(1)）双结构</li></ul><p><strong>跳表（Skip List）原理</strong>：多层有序链表。底层包含所有元素，上层是"快速通道"（类似书的目录）。查找时从最高层开始，逐层下降。平均 O(logN) 时间复杂度。比红黑树实现简单，范围查询更高效（链表直接遍历）。Redis 跳表最多 32 层，晋升概率 1/4。</p><p><strong>核心命令</strong>：ZADD/ZREM/ZSCORE/ZRANK/ZREVRANK/ZRANGE/ZREVRANGE/ZRANGEBYSCORE/ZCOUNT/ZINCRBY/ZCARD</p>',
        scenario: '1. 排行榜：ZADD leaderboard score member，ZREVRANGE 取 Top N\n2. 延迟队列：score 存执行时间戳，轮询 ZRANGEBYSCORE 取到期任务\n3. 带权重的标签：score 表示权重/热度\n4. 滑动窗口限流：score 存时间戳',
        codeExample: 'ZSetOperations<String, String> zset =\n    stringRedis.opsForZSet();\n\n// 排行榜\nzset.add("leaderboard", "玩家A", 1500);\nzset.add("leaderboard", "玩家B", 2300);\nzset.add("leaderboard", "玩家C", 1800);\n\n// 加分\nzset.incrementScore("leaderboard", "玩家A", 200);\n\n// Top 3（分数从高到低）\nSet<ZSetOperations.TypedTuple<String>> top3 =\n    zset.reverseRangeWithScores("leaderboard", 0, 2);\n\n// 查排名（0 开始）\nLong rank = zset.reverseRank("leaderboard", "玩家A");\n\n// 延迟队列\nlong executeAt = System.currentTimeMillis() + 60000;\nzset.add("delay:queue", taskJson, executeAt);\n\n// 消费者轮询\nlong now = System.currentTimeMillis();\nSet<String> tasks = zset.rangeByScore(\n    "delay:queue", 0, now);\nfor (String task : tasks) {\n    processTask(task);\n    zset.remove("delay:queue", task);\n}',
        estimatedMinutes: 35,
        tags: ['核心数据结构', '必学']
      }
    ]
  },
  {
    id: 'redis-advanced-structures',
    title: '高级数据结构',
    description: '掌握 Redis 特殊数据结构在实际业务中的应用',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'redis-bitmap',
        title: 'Bitmap（签到统计）',
        shortDesc: 'Bitmap 用 0 和 1 的"位数组"表示状态，1 亿用户的签到数据只占 12MB',
        deepPrinciple: '<p><strong>Bitmap</strong> 不是独立数据类型，本质是 String 的位操作扩展。每个 bit 位存 0 或 1。</p><p><strong>内存优势</strong>：1 亿用户的签到状态只需 100,000,000 bit = 12.5 MB。如果用 Hash 存，每个 field 至少 几十字节，需要 GB 级内存。</p><p><strong>核心命令</strong>：</p><ul><li>SETBIT key offset value — 设置某位</li><li>GETBIT key offset — 获取某位</li><li>BITCOUNT key [start end] — 统计 1 的个数</li><li>BITOP AND/OR/XOR/NOT dest key1 key2 — 位运算</li><li>BITPOS key bit [start end] — 查找第一个 0 或 1 的位置</li></ul><p><strong>底层实现</strong>：SDS 存储字节数组，每个字节 8 bit。SETBIT 时如果 offset 超过当前长度会自动扩展（填 0）。</p>',
        scenario: '1. 用户签到：SETBIT sign:2024:01:uid 天数 1（每月一个 key，offset 是日期）\n2. 用户活跃统计：BITCOUNT 统计月活跃天数\n3. 布隆过滤器底层：多个哈希函数映射到 bit 位',
        codeExample: '// 签到系统\npublic void sign(Long userId, LocalDate date) {\n    String key = "sign:" + date.getYear() + ":"\n        + date.getMonthValue() + ":" + userId;\n    int day = date.getDayOfMonth() - 1;\n    stringRedis.opsForValue().setBit(key, day, true);\n}\n\n// 查询某天是否签到\npublic boolean isSigned(Long userId, LocalDate date) {\n    String key = "sign:" + date.getYear() + ":"\n        + date.getMonthValue() + ":" + userId;\n    return Boolean.TRUE.equals(\n        stringRedis.opsForValue()\n            .getBit(key, date.getDayOfMonth() - 1));\n}\n\n// 统计当月签到天数\npublic Long countSignDays(Long userId, int year, int month) {\n    String key = "sign:" + year + ":" + month + ":" + userId;\n    // 使用 execute 执行 BITCOUNT\n    return stringRedis.execute((RedisCallback<Long>)\n        conn -> conn.stringCommands().bitCount(\n            key.getBytes()));\n}',
        estimatedMinutes: 30,
        tags: ['高级数据结构', '实用']
      },
      {
        id: 'redis-hyperloglog',
        title: 'HyperLogLog（UV 去重统计）',
        shortDesc: 'HyperLogLog 用 12KB 固定内存就能统计上亿级别的不同元素数量，误差仅 0.81%',
        deepPrinciple: '<p><strong>HyperLogLog（HLL）</strong>是概率性数据结构，用于<strong>基数估算</strong>（统计不同元素数量）。</p><p><strong>核心优势</strong>：无论数据量多大，每个 HLL 固定占用 <strong>12KB</strong> 内存。</p><p><strong>算法原理</strong>：基于伯努利实验。将元素哈希后观察二进制末尾连续 0 的最大长度 k，用 2^k 估算基数。Redis 使用 16384 个桶（寄存器），取调和平均值，误差约 <strong>0.81%</strong>。</p><p><strong>稀疏/密集编码</strong>：少量数据时用稀疏编码（几十字节），超过阈值自动转为密集编码（12KB）。</p><p><strong>核心命令</strong>：PFADD（添加元素）、PFCOUNT（估算基数）、PFMERGE（合并多个 HLL）</p><p><strong>适用场景</strong>：不要求精确值、数据量大、需要节省内存的去重计数场景。</p>',
        scenario: '统计网站日/月 UV（独立访客数）。如果用 Set 存用户 ID，1000 万 UV 需要 ~640MB；HLL 只需 12KB，误差可接受。',
        codeExample: '// 统计页面 UV\npublic void recordPageView(String pageId, String userId) {\n    String key = "uv:" + LocalDate.now() + ":" + pageId;\n    stringRedis.opsForHyperLogLog().add(key, userId);\n}\n\n// 获取 UV 数\npublic Long getPageUV(String pageId, LocalDate date) {\n    String key = "uv:" + date + ":" + pageId;\n    return stringRedis.opsForHyperLogLog().size(key);\n}\n\n// 合并多天 UV（去重）\npublic Long getWeeklyUV(String pageId) {\n    List<String> keys = new ArrayList<>();\n    for (int i = 0; i < 7; i++) {\n        keys.add("uv:" + LocalDate.now().minusDays(i)\n            + ":" + pageId);\n    }\n    String destKey = "uv:weekly:" + pageId;\n    stringRedis.opsForHyperLogLog()\n        .union(destKey, keys.toArray(new String[0]));\n    return stringRedis.opsForHyperLogLog().size(destKey);\n}',
        estimatedMinutes: 25,
        tags: ['高级数据结构', '实用']
      },
      {
        id: 'redis-geo',
        title: 'Geo（附近的人/LBS）',
        shortDesc: 'Geo 存储经纬度坐标，一条命令就能查出"附近 5 公里内的所有商家"',
        deepPrinciple: '<p><strong>Geo</strong> 底层用 <strong>Sorted Set</strong> 实现，将经纬度通过 <strong>GeoHash</strong> 算法编码为 52 位整数作为 score。</p><p><strong>GeoHash 原理</strong>：将地球表面递归二分为网格。经度范围 [-180, 180] 和纬度范围 [-85.05, 85.05] 交替编码为二进制，再用 Base32 编码为字符串。相邻的位置 GeoHash 值相近，适合范围查询。</p><p><strong>核心命令</strong>：GEOADD（添加坐标）、GEOPOS（获取坐标）、GEODIST（两点距离）、GEOSEARCH/GEORADIUS（范围搜索）、GEOHASH（获取哈希值）</p><p><strong>精度</strong>：Redis Geo 使用 52 位 GeoHash，精度约 0.6 米，满足绝大多数 LBS 场景。</p>',
        scenario: '1. 附近的人/店铺：GEOSEARCH 查指定范围内的 member\n2. 外卖配送：计算骑手到商家距离\n3. 打车：查附近可用车辆',
        codeExample: '// 添加商家位置\nGeoOperations<String, String> geo =\n    stringRedis.opsForGeo();\ngeo.add("shops",\n    new Point(116.403963, 39.915119), "天安门烤鸭店");\ngeo.add("shops",\n    new Point(116.397128, 39.916527), "故宫奶茶");\ngeo.add("shops",\n    new Point(116.414000, 39.912000), "王府井书店");\n\n// 查两店距离\nDistance dist = geo.distance(\n    "shops", "天安门烤鸭店", "故宫奶茶",\n    Metrics.KILOMETERS);\nSystem.out.println(dist.getValue() + " km");\n\n// 搜索附近 3 公里内的店\nGeoResults<RedisGeoCommands.GeoLocation<String>> results =\n    geo.search("shops",\n        GeoReference.fromMember("天安门烤鸭店"),\n        new Distance(3, Metrics.KILOMETERS),\n        RedisGeoCommands.GeoSearchCommandArgs.newArgs()\n            .includeDistance().limit(10));\n\nresults.forEach(r -> {\n    System.out.println(r.getContent().getName()\n        + " - " + r.getDistance().getValue() + "km");\n});',
        estimatedMinutes: 25,
        tags: ['高级数据结构', '实用']
      },
      {
        id: 'redis-stream',
        title: 'Stream（消息队列）',
        shortDesc: 'Stream 是 Redis 5.0 引入的"消息队列"——支持消费者组、消息确认、持久化，对标 Kafka 轻量版',
        deepPrinciple: '<p><strong>Stream</strong> 是 Redis 5.0 引入的日志型数据结构，专为消息队列设计。</p><p><strong>核心特性</strong>：</p><ul><li><strong>消费者组（Consumer Group）</strong>：多个消费者分摊消息，不重复消费</li><li><strong>消息确认（ACK）</strong>：消费后 XACK 确认，未确认的消息可重新投递</li><li><strong>持久化</strong>：消息持久存储在 Redis 中（受 RDB/AOF 保护）</li><li><strong>历史回溯</strong>：可以从任意位置重新读取消息</li></ul><p><strong>底层实现</strong>：基于 Radix Tree（基数树）+ listpack。每个节点包含多条消息，内存效率高。消息 ID 格式：<code>时间戳-序号</code>，如 <code>1609459200000-0</code>。</p><p><strong>核心命令</strong>：XADD（发送消息）、XREAD（读取，支持阻塞）、XGROUP CREATE（创建消费者组）、XREADGROUP（消费者组读取）、XACK（确认）、XPENDING（查看未确认消息）、XLEN（队列长度）</p><p><strong>vs List 做队列</strong>：Stream 支持消费者组、消息确认、消息回溯，更适合可靠消息队列；List 只是简单的 FIFO。</p>',
        scenario: '订单创建后发送消息到 Stream，多个消费者（库存服务、通知服务、积分服务）通过消费者组分别消费。',
        codeExample: '// 发送消息\nMapRecord<String, String, String> record =\n    StreamRecords.newRecord()\n        .ofMap(Map.of(\n            "orderId", "1001",\n            "userId", "2001",\n            "amount", "99.9"))\n        .withStreamKey("stream:orders");\nRecordId id = stringRedis.opsForStream().add(record);\n\n// 创建消费者组\nstringRedis.opsForStream().createGroup(\n    "stream:orders", "inventory-group");\n\n// 消费消息\nList<MapRecord<String, String, String>> messages =\n    stringRedis.opsForStream().read(\n        Consumer.from("inventory-group", "consumer-1"),\n        StreamReadOptions.empty()\n            .count(10)\n            .block(Duration.ofSeconds(5)),\n        StreamOffset.create("stream:orders",\n            ReadOffset.lastConsumed()));\n\n// 处理并确认\nfor (MapRecord<String, String, String> msg : messages) {\n    processOrder(msg.getValue());\n    stringRedis.opsForStream().acknowledge(\n        "stream:orders", "inventory-group", msg.getId());\n}',
        estimatedMinutes: 30,
        tags: ['高级数据结构', '进阶']
      }
    ]
  },
  {
    id: 'redis-persistence',
    title: '持久化机制',
    description: '深入理解 RDB、AOF 和混合持久化的原理与配置',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'redis-rdb',
        title: 'RDB 快照原理（fork + COW）',
        shortDesc: 'RDB 就像定时拍照——在某个时间点把内存数据完整"拍"一张快照存到磁盘',
        deepPrinciple: '<p><strong>RDB（Redis Database）</strong>在指定时间间隔内将内存数据生成快照保存到磁盘（dump.rdb）。</p><p><strong>触发方式</strong>：</p><ul><li><code>save</code> 命令：<strong>阻塞</strong>主线程，直到 RDB 完成（生产禁用！）</li><li><code>bgsave</code> 命令：fork 子进程，<strong>后台</strong>生成 RDB</li><li>配置自动触发：<code>save 900 1</code>（900 秒内有 1 次修改就触发）</li></ul><p><strong>fork + COW（Copy-On-Write）原理</strong>：</p><ol><li>主进程调用 <code>fork()</code> 创建子进程。fork 时操作系统只复制页表（指针），<strong>不复制实际内存数据</strong>，所以 fork 非常快</li><li>子进程和主进程<strong>共享同一份物理内存</strong></li><li>子进程开始遍历内存，将数据写入临时 RDB 文件</li><li>当主进程修改某页数据时，操作系统触发 <strong>COW</strong>：先复制这一页的副本，然后修改副本。子进程仍然读到 fork 时刻的旧数据</li><li>子进程写完后，用临时文件<strong>原子替换</strong>旧的 dump.rdb</li></ol><p><strong>优缺点</strong>：</p><ul><li>优：二进制紧凑文件，恢复速度快（直接加载到内存）；适合定期备份</li><li>缺：两次快照之间的数据可能丢失；fork 时如果内存大，可能短暂阻塞（几十~几百 ms）；COW 最坏情况下内存翻倍</li></ul>',
        scenario: '每天凌晨 bgsave 一次作为备份，拷贝 dump.rdb 到远程存储。灾难恢复时直接把 rdb 文件放回 Redis 数据目录重启即可。',
        codeExample: '// redis.conf 配置\n// save 900 1    # 900 秒内至少 1 次修改\n// save 300 10   # 300 秒内至少 10 次修改\n// save 60 10000 # 60 秒内至少 10000 次修改\n//\n// dbfilename dump.rdb\n// dir /data/redis/\n// rdbcompression yes  # LZF 压缩\n// rdbchecksum yes     # CRC64 校验\n\n// 手动触发\n// redis-cli BGSAVE\n// redis-cli LASTSAVE  # 最后一次成功 RDB 的时间戳\n\n// Java 中查看 RDB 信息\npublic Map<String, String> getRdbInfo() {\n    Properties info = (Properties)\n        stringRedis.execute((RedisCallback<Object>)\n            conn -> conn.serverCommands().info("persistence"));\n    // rdb_last_save_time, rdb_last_bgsave_status 等\n    return info.entrySet().stream().collect(\n        Collectors.toMap(\n            e -> e.getKey().toString(),\n            e -> e.getValue().toString()));\n}',
        estimatedMinutes: 35,
        tags: ['持久化', '必学']
      },
      {
        id: 'redis-aof',
        title: 'AOF 日志原理（always/everysec/no）',
        shortDesc: 'AOF 像"记账本"——每笔操作都记录下来，恢复时重放所有操作',
        deepPrinciple: '<p><strong>AOF（Append Only File）</strong>以日志形式记录每一条<strong>写命令</strong>，追加到文件末尾。恢复时逐条重放命令。</p><p><strong>写入流程</strong>：命令执行成功 → 写入 AOF 缓冲区（aof_buf）→ 根据策略刷盘。</p><p><strong>三种刷盘策略（appendfsync）</strong>：</p><ul><li><strong>always</strong>：每条命令都 fsync。最安全（最多丢 1 条），但性能最差</li><li><strong>everysec</strong>（推荐）：每秒 fsync 一次。折中方案，最多丢 1 秒数据。由后台 bio 线程执行</li><li><strong>no</strong>：由操作系统决定何时 fsync（通常 30 秒）。性能最好但可能丢 30 秒数据</li></ul><p><strong>AOF 重写（Rewrite）</strong>：随着写入 AOF 文件越来越大。重写机制将内存中当前数据用最少命令重新生成 AOF 文件。例如对同一个 key 执行了 100 次 INCR，重写后只有一条 SET key 100。</p><p><strong>重写过程</strong>：fork 子进程 → 子进程遍历内存生成新 AOF → 主进程继续服务，新写入的命令同时追加到旧 AOF 和<strong>重写缓冲区</strong> → 子进程完成后，主进程将重写缓冲区内容追加到新 AOF → 原子替换旧文件。</p><p><strong>Redis 7.0 Multi-Part AOF</strong>：将 AOF 拆分为 base（基础 RDB）+ incr（增量 AOF）多个文件，重写时只替换 base，避免大文件 I/O 问题。</p>',
        scenario: '线上服务推荐 appendfsync everysec，兼顾安全和性能。配置 auto-aof-rewrite-percentage 100 和 auto-aof-rewrite-min-size 64mb 自动触发重写。',
        codeExample: '// redis.conf\n// appendonly yes\n// appendfsync everysec\n// auto-aof-rewrite-percentage 100  # AOF 比上次重写增长 100% 时触发\n// auto-aof-rewrite-min-size 64mb   # AOF 至少 64MB 才触发重写\n// aof-use-rdb-preamble yes         # 混合持久化（推荐）\n\n// AOF 文件内容示例（RESP 协议）\n// *3\\r\\n$3\\r\\nSET\\r\\n$5\\r\\nmykey\\r\\n$7\\r\\nmyvalue\\r\\n\n// 即: SET mykey myvalue\n\n// 手动触发重写\n// redis-cli BGREWRITEAOF\n\n// 修复损坏的 AOF 文件\n// redis-check-aof --fix appendonly.aof',
        estimatedMinutes: 35,
        tags: ['持久化', '必学']
      },
      {
        id: 'redis-mixed-persistence',
        title: '混合持久化 RDB + AOF',
        shortDesc: '混合持久化取两家之长——用 RDB 的快速恢复 + AOF 的少丢数据，是生产环境最佳选择',
        deepPrinciple: '<p><strong>混合持久化（Redis 4.0+）</strong>：AOF 重写时，不再纯写 AOF 命令，而是将 fork 时刻的内存数据以 <strong>RDB 格式</strong>写入 AOF 文件头部，之后的增量命令以 <strong>AOF 格式</strong>追加。</p><p><strong>文件结构</strong>：[RDB 二进制数据][AOF 增量命令]</p><p><strong>优势</strong>：</p><ul><li>恢复速度：RDB 部分直接加载到内存（快），AOF 部分只需重放少量增量命令</li><li>数据安全：比纯 RDB 丢数据更少（只丢最后 1 秒的增量）</li><li>文件大小：比纯 AOF 小很多（RDB 是二进制压缩）</li></ul><p><strong>开启方式</strong>：<code>aof-use-rdb-preamble yes</code>（Redis 5.0+ 默认开启）</p><p><strong>生产推荐配置</strong>：appendonly yes + appendfsync everysec + aof-use-rdb-preamble yes</p>',
        scenario: '生产环境 Redis 同时开启 AOF 和混合持久化，兼顾恢复速度和数据安全性。重启后几秒内完成数据恢复。',
        codeExample: '// 生产推荐配置\n// appendonly yes\n// appendfsync everysec\n// aof-use-rdb-preamble yes\n//\n// # 同时保留 RDB 作为备份\n// save 3600 1\n// save 300 100\n\n// 恢复优先级：AOF > RDB\n// 如果 appendonly yes，优先从 AOF 恢复\n// 如果 AOF 不存在，才从 RDB 恢复\n\n// 备份策略示例（crontab）\n// 每小时备份 AOF + RDB 到远程\n// 0 * * * * cp /data/redis/dump.rdb /backup/\n// 0 * * * * cp /data/redis/appendonly.aof /backup/',
        estimatedMinutes: 25,
        tags: ['持久化', '必学']
      },
      {
        id: 'redis-data-recovery',
        title: '数据恢复流程',
        shortDesc: '数据恢复就像"读取存档"——Redis 启动时自动从持久化文件加载数据到内存',
        deepPrinciple: '<p><strong>Redis 启动数据恢复流程</strong>：</p><ol><li>检查是否配置了 <code>appendonly yes</code></li><li><strong>如果开启 AOF</strong>：优先从 AOF 文件恢复（数据更完整）<ul><li>混合持久化：先加载 RDB 头部，再重放 AOF 增量</li><li>纯 AOF：逐条重放所有命令（大文件恢复较慢）</li></ul></li><li><strong>如果没有 AOF 或 AOF 损坏</strong>：从 dump.rdb 恢复</li><li>如果都没有：空数据库启动</li></ol><p><strong>AOF 文件损坏修复</strong>：<code>redis-check-aof --fix</code> 工具会截断 AOF 文件到最后一个正确命令。</p><p><strong>RDB 文件校验</strong>：<code>redis-check-rdb dump.rdb</code> 验证完整性。</p><p><strong>恢复速度参考</strong>：RDB 恢复 1GB 数据约几秒，纯 AOF 恢复同量数据可能需要几十秒到几分钟。</p>',
        scenario: 'Redis 服务器意外宕机重启后，自动从 AOF 文件恢复数据。如果 AOF 文件末尾损坏，用 redis-check-aof --fix 修复后重启。',
        codeExample: '// 数据恢复步骤\n\n// 1. 检查 AOF 文件完整性\n// redis-check-aof appendonly.aof\n\n// 2. 如果损坏，修复（截断到最后一个有效命令）\n// redis-check-aof --fix appendonly.aof\n\n// 3. 检查 RDB 文件完整性\n// redis-check-rdb dump.rdb\n\n// 4. 从备份恢复\n// cp /backup/dump.rdb /data/redis/\n// cp /backup/appendonly.aof /data/redis/\n// redis-server /etc/redis.conf\n\n// 5. 验证数据\n// redis-cli DBSIZE          # 查看 key 数量\n// redis-cli INFO keyspace   # 查看各 db 的 key 数\n\n// Java 中检查恢复状态\npublic boolean isDataLoaded() {\n    String info = stringRedis.getConnectionFactory()\n        .getConnection().serverCommands()\n        .info("persistence").getProperty("loading");\n    return "0".equals(info); // 0 表示加载完成\n}',
        estimatedMinutes: 25,
        tags: ['持久化', '运维']
      }
    ]
  },
  {
    id: 'redis-expiration-eviction',
    title: '过期策略与内存淘汰',
    description: '深入理解 Redis 的过期键删除机制和内存淘汰策略',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'redis-ttl-delete',
        title: 'TTL 设置与惰性删除 + 定期删除',
        shortDesc: '过期键不是到期就立刻删除——而是"懒删除 + 定期巡检"双保险，节省 CPU 开销',
        deepPrinciple: '<p><strong>TTL 设置</strong>：EXPIRE key seconds / PEXPIRE key ms / SET key value EX seconds / EXPIREAT key timestamp。</p><p><strong>过期键删除策略</strong>（两种结合）：</p><ul><li><strong>惰性删除（Lazy Expiration）</strong>：访问某个 key 时才检查是否过期，过期就删除返回 nil。优点：不浪费 CPU；缺点：如果 key 一直不被访问，过期了也不删，<strong>内存泄漏</strong></li><li><strong>定期删除（Periodic Expiration）</strong>：Redis 每 100ms（可配置 hz）触发一次，随机抽取 20 个设了过期时间的 key 检查，删除过期的。如果过期比例 &gt; 25%，再抽 20 个，循环直到比例 &lt; 25% 或超时（25ms）</li></ul><p><strong>为什么不用定时删除</strong>：给每个 key 创建定时器，key 很多时 CPU 开销太大。</p><p><strong>过期键在 RDB/AOF 中的处理</strong>：RDB 生成时跳过过期键；AOF 重写时也跳过；AOF 追加时过期键被删除会追加一条 DEL 命令。</p>',
        scenario: '设置缓存 30 分钟过期：SET cache:product:1 json EX 1800。过期后，如果再次访问（惰性删除）或定期扫描到就会被删除释放内存。',
        codeExample: '// TTL 设置\nstringRedis.opsForValue().set("token:abc", userId,\n    2, TimeUnit.HOURS);\n\n// 查看剩余过期时间\nLong ttl = stringRedis.getExpire("token:abc",\n    TimeUnit.SECONDS);\n\n// 修改过期时间\nstringRedis.expire("token:abc", 1, TimeUnit.HOURS);\n\n// 移除过期时间（变为永不过期）\nstringRedis.persist("token:abc");\n\n// redis.conf 调整定期删除频率\n// hz 10  # 默认每秒 10 次定期检查（每 100ms 一次）\n// 提高到 hz 100 可以更快清理过期键，但 CPU 开销更大',
        estimatedMinutes: 30,
        tags: ['内存管理', '必学']
      },
      {
        id: 'redis-eviction-policies',
        title: '8 种内存淘汰策略',
        shortDesc: '当内存满了 Redis 的"断舍离"策略——决定优先扔掉哪些数据腾出空间',
        deepPrinciple: '<p>当内存超过 <code>maxmemory</code> 时，Redis 根据淘汰策略决定删除哪些 key：</p><ul><li><strong>noeviction</strong>（默认）：不淘汰，写入直接报错 OOM。适合不允许数据丢失的场景</li><li><strong>volatile-lru</strong>：在<strong>设了过期时间</strong>的 key 中淘汰<strong>最近最少使用</strong>的</li><li><strong>allkeys-lru</strong>：在<strong>所有 key</strong> 中淘汰最近最少使用的。<strong>最常用的缓存策略</strong></li><li><strong>volatile-lfu</strong>：在设了过期时间的 key 中淘汰<strong>使用频率最低</strong>的（Redis 4.0+）</li><li><strong>allkeys-lfu</strong>：在所有 key 中淘汰使用频率最低的</li><li><strong>volatile-random</strong>：在设了过期时间的 key 中随机淘汰</li><li><strong>allkeys-random</strong>：在所有 key 中随机淘汰</li><li><strong>volatile-ttl</strong>：淘汰即将过期的 key（TTL 最小的优先）</li></ul><p><strong>推荐</strong>：纯缓存场景用 <code>allkeys-lru</code>；缓存 + 持久数据混合用 <code>volatile-lru</code>。</p>',
        scenario: 'Redis 用作缓存，maxmemory 设为 4GB，淘汰策略设为 allkeys-lru。内存满时自动淘汰最久没被访问的缓存，保留热点数据。',
        codeExample: '// redis.conf\n// maxmemory 4gb\n// maxmemory-policy allkeys-lru\n// maxmemory-samples 5  # LRU 采样数，越大越精确但越慢\n\n// 动态修改\n// redis-cli CONFIG SET maxmemory 4gb\n// redis-cli CONFIG SET maxmemory-policy allkeys-lru\n\n// 查看内存使用\n// redis-cli INFO memory\n// used_memory_human: 3.2G\n// maxmemory_human: 4G\n// maxmemory_policy: allkeys-lru\n\n// Java 中监控内存\npublic Map<String, String> getMemoryInfo() {\n    Properties info = (Properties)\n        stringRedis.execute((RedisCallback<Object>)\n            conn -> conn.serverCommands().info("memory"));\n    return Map.of(\n        "used", info.getProperty("used_memory_human"),\n        "max", info.getProperty("maxmemory_human"),\n        "policy", info.getProperty("maxmemory_policy"));\n}',
        estimatedMinutes: 30,
        tags: ['内存管理', '必学']
      },
      {
        id: 'redis-lru-vs-lfu',
        title: 'LRU vs LFU 算法原理',
        shortDesc: 'LRU 淘汰"最久没用的"，LFU 淘汰"用得最少的"——偶尔翻一次的书 vs 从来不看的书',
        deepPrinciple: '<p><strong>LRU（Least Recently Used）</strong>：</p><ul><li>标准 LRU 用链表 + 哈希表，O(1) 操作。但 Redis 不用标准 LRU（内存开销大）</li><li><strong>Redis 近似 LRU</strong>：每个 key 在 redisObject 中记录最后访问时间（lru 字段，24 bit，秒级精度）。淘汰时随机采样 maxmemory-samples 个 key（默认 5），删除其中 lru 最旧的。采样数越大越接近标准 LRU</li><li>缺点：对"偶尔被访问一次的冷数据"保护过度。例如全表扫描会刷新所有 key 的访问时间</li></ul><p><strong>LFU（Least Frequently Used，Redis 4.0+）</strong>：</p><ul><li>基于访问<strong>频率</strong>而非时间。redisObject 的 lru 字段拆分为：高 16 位存上次衰减时间（分钟），低 8 位存对数频率计数器（0-255）</li><li><strong>对数计数器</strong>：不是简单 +1，而是概率递增。频率越高，递增概率越低。counter=255 大约对应 100 万次访问</li><li><strong>衰减机制</strong>：每隔一段时间 counter 会衰减（lfu-decay-time 配置），防止历史热点永远不被淘汰</li><li>优点：比 LRU 更精确，不会因为偶尔一次访问就保留冷数据</li></ul>',
        scenario: '缓存场景如果有"周期性批量扫描"操作会污染 LRU（把冷数据都刷成热），此时用 LFU 更合适。一般缓存场景 LRU 足够。',
        codeExample: '// LRU 配置\n// maxmemory-policy allkeys-lru\n// maxmemory-samples 10  # 采样数越大越精确\n\n// LFU 配置\n// maxmemory-policy allkeys-lfu\n// lfu-log-factor 10     # 对数因子，越大计数器增长越慢\n// lfu-decay-time 1      # 每 1 分钟衰减一次\n\n// 查看某个 key 的空闲时间（LRU）\n// OBJECT IDLETIME mykey  # 多久没被访问（秒）\n\n// 查看某个 key 的访问频率（LFU）\n// OBJECT FREQ mykey      # 对数频率值（0-255）\n\n// 对比示例：\n// key A: 1 小时前被访问 1 次\n// key B: 5 分钟前被访问 1 次，之前从未访问\n// LRU 会淘汰 A（更久没访问）\n// LFU 会淘汰 B（访问频率更低）\n// 如果 A 是每天定时任务扫到的冷数据，LFU 的判断更合理',
        estimatedMinutes: 30,
        tags: ['内存管理', '面试重点']
      }
    ]
  },
  {
    id: 'redis-cache-problems',
    title: '缓存三大问题',
    description: '掌握缓存穿透、击穿、雪崩的原因和解决方案',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'cache-penetration',
        title: '缓存穿透（布隆过滤器/缓存空值）',
        shortDesc: '穿透就是"查不存在的数据"——缓存没有，数据库也没有，每次请求都打到数据库',
        deepPrinciple: '<p><strong>缓存穿透</strong>：请求的数据在缓存和数据库中<strong>都不存在</strong>，每次请求都穿透缓存直达数据库。</p><p><strong>恶意攻击场景</strong>：攻击者用大量不存在的 ID（如负数、超大数）疯狂请求，缓存永远 miss，数据库被打垮。</p><p><strong>解决方案</strong>：</p><ul><li><strong>缓存空值</strong>：查数据库返回 null 时，缓存一个空值（TTL 设短，如 2 分钟），下次直接返回空值不查 DB。简单有效，但会占用缓存空间</li><li><strong>布隆过滤器（Bloom Filter）</strong>：在缓存前加一层布隆过滤器。将所有合法 ID 加入布隆过滤器，请求先查布隆过滤器，如果判断"不存在"就直接返回，不查缓存和 DB。有一定误判率（判断存在可能不存在，判断不存在一定不存在）</li><li><strong>参数校验</strong>：在入口处校验参数合法性（如 ID &gt; 0），拦截明显非法请求</li></ul><p><strong>布隆过滤器原理</strong>：一个大的 bit 数组 + 多个哈希函数。添加元素时，用 k 个哈希函数计算 k 个位置并设为 1。查询时检查这 k 个位置是否全为 1，全 1 表示可能存在，有 0 表示一定不存在。</p>',
        scenario: '电商商品详情页被恶意请求大量不存在的商品 ID，导致数据库 QPS 暴增。加布隆过滤器后，非法请求在过滤器层就被拦截。',
        codeExample: '// 方案1：缓存空值\npublic Product getProduct(Long id) {\n    String key = "product:" + id;\n    String cached = stringRedis.opsForValue().get(key);\n\n    if (cached != null) {\n        if ("NULL".equals(cached)) return null; // 空值标记\n        return JSON.parseObject(cached, Product.class);\n    }\n\n    Product product = productRepo.findById(id).orElse(null);\n    if (product != null) {\n        stringRedis.opsForValue().set(key,\n            JSON.toJSONString(product), 30, TimeUnit.MINUTES);\n    } else {\n        // 缓存空值，短过期\n        stringRedis.opsForValue().set(key,\n            "NULL", 2, TimeUnit.MINUTES);\n    }\n    return product;\n}\n\n// 方案2：布隆过滤器（Redisson 实现）\n@PostConstruct\npublic void initBloomFilter() {\n    RBloomFilter<Long> bloom = redisson\n        .getBloomFilter("product:bloom");\n    bloom.tryInit(1000000, 0.01); // 100 万容量，1% 误判率\n    // 预加载所有商品 ID\n    productRepo.findAllIds().forEach(bloom::add);\n}\n\npublic Product getProductSafe(Long id) {\n    // 布隆过滤器判断\n    if (!bloomFilter.contains(id)) {\n        return null; // 一定不存在\n    }\n    // 正常缓存查询...\n}',
        estimatedMinutes: 35,
        tags: ['缓存问题', '面试重点']
      },
      {
        id: 'cache-breakdown',
        title: '缓存击穿（互斥锁/永不过期）',
        shortDesc: '击穿就是"热点 key 过期的瞬间"——大量请求同时涌向数据库，像子弹击穿了盾牌',
        deepPrinciple: '<p><strong>缓存击穿</strong>：某个<strong>热点 key</strong> 过期的瞬间，大量并发请求同时发现缓存失效，全部涌向数据库查询，瞬间压力暴增。</p><p><strong>与穿透的区别</strong>：穿透是数据不存在；击穿是数据存在但缓存过期。</p><p><strong>解决方案</strong>：</p><ul><li><strong>互斥锁（Mutex Lock）</strong>：缓存失效时，只让一个线程去查数据库并重建缓存，其他线程等待或返回旧数据。用 Redis SETNX 实现分布式锁</li><li><strong>逻辑过期（永不过期 + 后台更新）</strong>：缓存不设 TTL（永不过期），但在 value 中存一个逻辑过期时间。读取时发现逻辑过期，开启后台线程异步更新缓存，当前请求返回旧数据。<strong>牺牲一致性换高可用</strong></li><li><strong>提前续期</strong>：在 key 即将过期前（如剩余 TTL < 阈值），异步刷新缓存</li></ul>',
        scenario: '微博某条热搜的缓存过期，瞬间几十万请求涌向数据库。用互斥锁让一个请求去重建缓存，其他请求短暂等待。',
        codeExample: '// 方案1：互斥锁\npublic Product getHotProduct(Long id) {\n    String key = "product:" + id;\n    String cached = stringRedis.opsForValue().get(key);\n    if (cached != null) {\n        return JSON.parseObject(cached, Product.class);\n    }\n\n    // 缓存未命中，尝试获取锁\n    String lockKey = "lock:product:" + id;\n    Boolean locked = stringRedis.opsForValue()\n        .setIfAbsent(lockKey, "1", 10, TimeUnit.SECONDS);\n\n    if (Boolean.TRUE.equals(locked)) {\n        try {\n            // 双重检查\n            cached = stringRedis.opsForValue().get(key);\n            if (cached != null) {\n                return JSON.parseObject(cached, Product.class);\n            }\n            // 查数据库并重建缓存\n            Product p = productRepo.findById(id).orElse(null);\n            if (p != null) {\n                stringRedis.opsForValue().set(key,\n                    JSON.toJSONString(p), 30, TimeUnit.MINUTES);\n            }\n            return p;\n        } finally {\n            stringRedis.delete(lockKey);\n        }\n    } else {\n        // 未获取锁，短暂等待后重试\n        Thread.sleep(50);\n        return getHotProduct(id);\n    }\n}\n\n// 方案2：逻辑过期\npublic Product getWithLogicalExpire(Long id) {\n    String key = "product:" + id;\n    String cached = stringRedis.opsForValue().get(key);\n    if (cached == null) return null;\n\n    CacheData<Product> data = JSON.parseObject(\n        cached, new TypeReference<>() {});\n    if (data.getExpireTime().isAfter(LocalDateTime.now())) {\n        return data.getData(); // 未过期\n    }\n    // 逻辑过期，异步更新\n    executor.submit(() -> rebuildCache(id));\n    return data.getData(); // 返回旧数据\n}',
        estimatedMinutes: 35,
        tags: ['缓存问题', '面试重点']
      },
      {
        id: 'cache-avalanche',
        title: '缓存雪崩（随机 TTL/多级缓存/限流）',
        shortDesc: '雪崩就是"大量缓存同时过期"——像雪山崩塌一样，数据库被瞬间压垮',
        deepPrinciple: '<p><strong>缓存雪崩</strong>：大量 key <strong>同一时间过期</strong>或 <strong>Redis 服务宕机</strong>，导致大量请求直达数据库。</p><p><strong>与击穿的区别</strong>：击穿是单个热点 key；雪崩是大批量 key 同时失效。</p><p><strong>解决方案</strong>：</p><ul><li><strong>随机 TTL</strong>：在基础过期时间上加随机值（如 30min + random(0-5min)），避免集中过期</li><li><strong>多级缓存</strong>：本地缓存（Caffeine/Guava）+ Redis + DB。Redis 挂了还有本地缓存兜底</li><li><strong>限流降级</strong>：使用 Sentinel/Hystrix 对数据库请求限流，超过阈值返回降级响应</li><li><strong>Redis 高可用</strong>：Sentinel 哨兵或 Cluster 集群，避免单点故障</li><li><strong>缓存预热</strong>：启动时提前加载热点数据到缓存</li></ul>',
        scenario: '电商大促前批量预热商品缓存，都设了 30 分钟过期。30 分钟后同时失效，数据库瞬间被打垮。改为 30min + random(0-300s)。',
        codeExample: '// 方案1：随机 TTL\npublic void cacheProduct(Product product) {\n    String key = "product:" + product.getId();\n    // 基础 30 分钟 + 随机 0-5 分钟\n    long ttl = 1800 + ThreadLocalRandom.current()\n        .nextLong(0, 300);\n    stringRedis.opsForValue().set(key,\n        JSON.toJSONString(product), ttl, TimeUnit.SECONDS);\n}\n\n// 方案2：多级缓存\n@Service\npublic class MultiLevelCacheService {\n    // L1: 本地缓存（Caffeine）\n    private final Cache<Long, Product> localCache =\n        Caffeine.newBuilder()\n            .maximumSize(10000)\n            .expireAfterWrite(5, TimeUnit.MINUTES)\n            .build();\n\n    // L2: Redis\n    private final StringRedisTemplate redis;\n\n    public Product getProduct(Long id) {\n        // L1 本地缓存\n        Product p = localCache.getIfPresent(id);\n        if (p != null) return p;\n\n        // L2 Redis\n        String cached = redis.opsForValue()\n            .get("product:" + id);\n        if (cached != null) {\n            p = JSON.parseObject(cached, Product.class);\n            localCache.put(id, p);\n            return p;\n        }\n\n        // L3 数据库\n        p = productRepo.findById(id).orElse(null);\n        if (p != null) {\n            redis.opsForValue().set("product:" + id,\n                JSON.toJSONString(p),\n                1800 + ThreadLocalRandom.current()\n                    .nextLong(300),\n                TimeUnit.SECONDS);\n            localCache.put(id, p);\n        }\n        return p;\n    }\n}',
        estimatedMinutes: 35,
        tags: ['缓存问题', '面试重点']
      }
    ]
  },
  {
    id: 'redis-distributed-lock',
    title: '分布式锁',
    description: '深入理解 Redis 分布式锁的实现原理与最佳实践',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'redis-setnx-lock',
        title: 'SETNX + 过期时间原子操作',
        shortDesc: '分布式锁像多人共用一个"更衣室"——SETNX 抢锁，拿到锁的人才能进去操作',
        deepPrinciple: '<p><strong>分布式锁</strong>：在分布式系统中，多个服务实例需要互斥访问共享资源。Redis 实现分布式锁的核心命令：</p><p><code>SET key value NX EX seconds</code></p><ul><li><strong>NX</strong>（Not eXists）：key 不存在才设置，保证只有一个客户端能获取锁</li><li><strong>EX</strong>：设置过期时间，防止持锁进程崩溃导致死锁</li><li><strong>value</strong>：设为唯一标识（UUID），释放锁时验证是自己的锁才删除</li></ul><p><strong>SET NX EX 必须是原子操作</strong>：不能分成 SETNX + EXPIRE 两步，因为如果 SETNX 成功后进程崩溃，EXPIRE 未执行，锁就永远不会释放（死锁）。</p><p><strong>释放锁的陷阱</strong>：必须用 Lua 脚本原子地"判断 + 删除"，否则可能误删别人的锁。场景：A 获取锁 → A 执行超时锁自动过期 → B 获取锁 → A 执行完删锁 → 删掉了 B 的锁！</p>',
        scenario: '电商秒杀扣减库存：多个服务实例同时处理订单，需要分布式锁保证同一商品的库存扣减是互斥的。',
        codeExample: '// 基础分布式锁实现\npublic class RedisLock {\n    private final StringRedisTemplate redis;\n    private static final String UNLOCK_SCRIPT =\n        "if redis.call(\'get\', KEYS[1]) == ARGV[1] then " +\n        "  return redis.call(\'del\', KEYS[1]) " +\n        "else return 0 end";\n\n    /**\n     * 获取锁\n     */\n    public String tryLock(String lockKey, long expireSec) {\n        String value = UUID.randomUUID().toString();\n        Boolean ok = redis.opsForValue().setIfAbsent(\n            lockKey, value, expireSec, TimeUnit.SECONDS);\n        return Boolean.TRUE.equals(ok) ? value : null;\n    }\n\n    /**\n     * 释放锁（Lua 脚本原子操作）\n     */\n    public boolean unlock(String lockKey, String value) {\n        DefaultRedisScript<Long> script =\n            new DefaultRedisScript<>(UNLOCK_SCRIPT, Long.class);\n        Long result = redis.execute(\n            script, List.of(lockKey), value);\n        return Long.valueOf(1).equals(result);\n    }\n}\n\n// 使用\nString lockVal = redisLock.tryLock("lock:stock:1001", 10);\nif (lockVal != null) {\n    try {\n        deductStock(1001, 1);\n    } finally {\n        redisLock.unlock("lock:stock:1001", lockVal);\n    }\n}',
        estimatedMinutes: 35,
        tags: ['分布式锁', '面试重点']
      },
      {
        id: 'redisson-watchdog',
        title: 'Redisson 看门狗续期机制',
        shortDesc: 'Redisson 看门狗像"自动续费"——锁快到期时自动延长，不用担心业务没执行完锁就过期了',
        deepPrinciple: '<p><strong>Redisson</strong> 是 Redis 的 Java 客户端，提供了生产级分布式锁实现。</p><p><strong>看门狗（Watchdog）机制</strong>：</p><ul><li>如果获取锁时<strong>没有指定过期时间</strong>，Redisson 默认设 30 秒过期（lockWatchdogTimeout）</li><li>获取锁成功后，启动一个后台定时任务（Watchdog），每隔 lockWatchdogTimeout/3（默认 10 秒）检查锁是否还被持有</li><li>如果持有，自动<strong>续期到 30 秒</strong>，保证业务执行期间锁不会过期</li><li>当线程执行完释放锁或线程崩溃（Watchdog 随之停止），锁会在 30 秒后自动过期</li></ul><p><strong>Redisson 锁的高级特性</strong>：</p><ul><li><strong>可重入</strong>：同一线程可多次获取同一把锁（内部用 Hash 记录重入次数）</li><li><strong>公平锁</strong>：按请求顺序获取锁</li><li><strong>读写锁</strong>：读锁共享、写锁互斥</li><li><strong>联锁（MultiLock）</strong>：同时获取多把锁</li></ul>',
        scenario: '订单处理可能耗时不确定（1秒~30秒），手动设锁超时不好估。用 Redisson 看门狗自动续期，业务执行多久锁就持有多久。',
        codeExample: '// Redisson 配置\n@Bean\npublic RedissonClient redissonClient() {\n    Config config = new Config();\n    config.useSingleServer()\n        .setAddress("redis://localhost:6379")\n        .setPassword("your-password");\n    return Redisson.create(config);\n}\n\n// 使用 Redisson 分布式锁\n@Service\npublic class OrderService {\n    @Autowired\n    private RedissonClient redisson;\n\n    public void createOrder(Long productId, int quantity) {\n        RLock lock = redisson.getLock("lock:stock:" + productId);\n        try {\n            // 尝试获取锁，最多等 5 秒\n            // 不指定 leaseTime → 开启看门狗自动续期\n            if (lock.tryLock(5, TimeUnit.SECONDS)) {\n                try {\n                    // 业务逻辑（看门狗自动续期）\n                    deductStock(productId, quantity);\n                    saveOrder(productId, quantity);\n                } finally {\n                    lock.unlock();\n                }\n            } else {\n                throw new BusinessException("系统繁忙，请重试");\n            }\n        } catch (InterruptedException e) {\n            Thread.currentThread().interrupt();\n            throw new RuntimeException(e);\n        }\n    }\n}\n\n// 读写锁\nRReadWriteLock rwLock = redisson.getReadWriteLock("rw:config");\nrwLock.readLock().lock();   // 读锁（共享）\nrwLock.writeLock().lock();  // 写锁（互斥）',
        estimatedMinutes: 35,
        tags: ['分布式锁', '必学']
      },
      {
        id: 'redlock-algorithm',
        title: 'RedLock 算法与锁对比',
        shortDesc: 'RedLock 在多个独立 Redis 节点上同时加锁——超过半数成功才算获取锁，避免主从切换丢锁',
        deepPrinciple: '<p><strong>单节点 Redis 锁的问题</strong>：如果 Redis 主节点宕机，从节点提升为主但锁数据还没同步过来，导致两个客户端同时持有锁。</p><p><strong>RedLock 算法</strong>（由 Redis 作者 Antirez 提出）：</p><ol><li>准备 N 个独立的 Redis 节点（推荐 5 个，互不主从）</li><li>客户端获取当前时间 T1</li><li>依次向 N 个节点发送 SET NX EX 请求</li><li>如果在大多数节点（N/2+1，即 3 个）上获取锁成功，且总耗时 &lt; 锁过期时间，则认为获取锁成功</li><li>锁的有效时间 = 初始过期时间 - 获取锁耗时</li><li>释放时向所有节点发送 DEL</li></ol><p><strong>争议</strong>：Martin Kleppmann 指出 RedLock 依赖时钟同步，在 GC 暂停、时钟跳变等场景下可能不安全。实际生产中大多数场景用 Redisson 单节点锁 + 看门狗即可。</p><p><strong>分布式锁对比</strong>：</p><ul><li><strong>Redis</strong>：性能最好（10 万 QPS），AP 模型，极端情况可能丢锁</li><li><strong>ZooKeeper</strong>：CP 模型，强一致，但性能较低（1 万 QPS），实现复杂</li><li><strong>etcd</strong>：CP 模型，Raft 协议，性能介于两者之间，Kubernetes 生态首选</li></ul>',
        scenario: '金融交易等强一致性场景，单节点 Redis 锁安全性不够。可以用 Redisson 的 RedLock 或改用 ZooKeeper/etcd 锁。一般互联网业务用 Redisson 单节点足够。',
        codeExample: '// Redisson RedLock（多节点锁）\nRLock lock1 = redisson1.getLock("lock:transfer");\nRLock lock2 = redisson2.getLock("lock:transfer");\nRLock lock3 = redisson3.getLock("lock:transfer");\n\nRedissonRedLock redLock = new RedissonRedLock(\n    lock1, lock2, lock3);\ntry {\n    if (redLock.tryLock(5, 30, TimeUnit.SECONDS)) {\n        try {\n            // 在大多数节点上获取了锁\n            doTransfer();\n        } finally {\n            redLock.unlock();\n        }\n    }\n} catch (InterruptedException e) {\n    Thread.currentThread().interrupt();\n}\n\n// 实际生产中更多用 Redisson 单节点（足够大多数场景）\n// 如需强一致，考虑 ZooKeeper：\n// InterProcessMutex lock = new InterProcessMutex(\n//     curatorClient, "/locks/transfer");\n// lock.acquire(5, TimeUnit.SECONDS);\n// try { doTransfer(); } finally { lock.release(); }',
        estimatedMinutes: 30,
        tags: ['分布式锁', '面试重点']
      }
    ]
  },
  {
    id: 'redis-springboot-integration',
    title: 'Spring Boot 集成 Redis 进阶',
    description: '掌握 Spring Cache 注解详细用法与自定义配置',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'spring-cache-annotations-detail',
        title: 'Spring Cache 注解详解',
        shortDesc: '@Cacheable 查缓存、@CachePut 更新缓存、@CacheEvict 删缓存、@Caching 组合操作',
        deepPrinciple: '<p><strong>@Cacheable</strong> 详解：</p><ul><li><code>value/cacheNames</code>：缓存名称（命名空间），实际 key = cacheName::key</li><li><code>key</code>：SpEL 表达式。#id、#user.name、#root.methodName、#root.args[0]</li><li><code>condition</code>：满足条件才缓存（在方法执行<strong>前</strong>判断）。<code>condition = "#id > 0"</code></li><li><code>unless</code>：满足条件<strong>不</strong>缓存（在方法执行<strong>后</strong>判断，可以用 #result）。<code>unless = "#result == null"</code></li><li><code>sync = true</code>：同步模式，防止缓存击穿（只有一个线程查 DB）</li></ul><p><strong>@CachePut</strong>：每次都执行方法，用结果更新缓存。适合更新操作。</p><p><strong>@CacheEvict</strong>：删除缓存。allEntries=true 清空整个 cacheName。beforeInvocation=true 在方法执行前删除。</p><p><strong>@Caching</strong>：组合多个缓存操作。</p>',
        scenario: '用户信息更新时，同时更新单用户缓存并清空用户列表缓存。',
        codeExample: '@Service\npublic class UserService {\n    // 查询缓存（防击穿 sync=true）\n    @Cacheable(value = "users", key = "#id",\n        unless = "#result == null", sync = true)\n    public User findById(Long id) {\n        return userRepo.findById(id).orElse(null);\n    }\n\n    // 条件缓存\n    @Cacheable(value = "users", key = "#id",\n        condition = "#id > 0",\n        unless = "#result?.status?.name() == \'DELETED\'")\n    public User findByIdSafe(Long id) {\n        return userRepo.findById(id).orElse(null);\n    }\n\n    // 更新缓存\n    @CachePut(value = "users", key = "#user.id")\n    public User update(User user) {\n        return userRepo.save(user);\n    }\n\n    // 组合操作：更新单用户缓存 + 清空列表缓存\n    @Caching(\n        put = @CachePut(value = "users", key = "#user.id"),\n        evict = @CacheEvict(value = "userList",\n            allEntries = true)\n    )\n    public User save(User user) {\n        return userRepo.save(user);\n    }\n\n    // 删除前清缓存\n    @CacheEvict(value = "users", key = "#id",\n        beforeInvocation = true)\n    public void delete(Long id) {\n        userRepo.deleteById(id);\n    }\n}',
        estimatedMinutes: 30,
        tags: ['Spring Cache', '必学']
      },
      {
        id: 'custom-key-generator',
        title: '自定义 KeyGenerator 与序列化',
        shortDesc: 'KeyGenerator 决定缓存 key 的生成规则，序列化器决定 value 的存储格式',
        deepPrinciple: '<p><strong>自定义 KeyGenerator</strong>：当 SpEL 表达式不够灵活时，实现 KeyGenerator 接口自定义 key 生成逻辑。</p><p><strong>自定义序列化</strong>：默认 JDK 序列化不可读。推荐 Jackson2JsonRedisSerializer（指定类型）或 GenericJackson2JsonRedisSerializer（通用，存 @class 信息）。</p><p><strong>CacheManager 自定义</strong>：为不同 cacheName 配置不同的 TTL、序列化方式等。</p>',
        scenario: '不同业务缓存需要不同 TTL：用户缓存 1 小时，商品缓存 30 分钟，配置缓存 24 小时。',
        codeExample: '// 自定义 KeyGenerator\n@Bean\npublic KeyGenerator customKeyGenerator() {\n    return (target, method, params) -> {\n        StringBuilder sb = new StringBuilder();\n        sb.append(target.getClass().getSimpleName());\n        sb.append(":").append(method.getName());\n        for (Object p : params) {\n            sb.append(":").append(p);\n        }\n        return sb.toString();\n    };\n}\n\n// 不同 cacheName 不同 TTL\n@Bean\npublic CacheManager cacheManager(RedisConnectionFactory f) {\n    // 默认配置\n    RedisCacheConfiguration defaultCfg =\n        RedisCacheConfiguration.defaultCacheConfig()\n            .entryTtl(Duration.ofMinutes(30))\n            .serializeValuesWith(SerializationPair\n                .fromSerializer(\n                    new GenericJackson2JsonRedisSerializer()));\n\n    // 特定 cacheName 配置\n    Map<String, RedisCacheConfiguration> configs = Map.of(\n        "users", defaultCfg.entryTtl(Duration.ofHours(1)),\n        "products", defaultCfg.entryTtl(Duration.ofMinutes(30)),\n        "config", defaultCfg.entryTtl(Duration.ofHours(24))\n    );\n\n    return RedisCacheManager.builder(f)\n        .cacheDefaults(defaultCfg)\n        .withInitialCacheConfigurations(configs)\n        .build();\n}',
        estimatedMinutes: 25,
        tags: ['Spring Cache', '进阶']
      },
      {
        id: 'cache-penetration-protection',
        title: '缓存穿透保护实战',
        shortDesc: '在 Spring Cache 层面防止缓存穿透——缓存 null 值 + 布隆过滤器双重保护',
        deepPrinciple: '<p><strong>Spring Cache 层面的穿透保护</strong>：</p><ul><li><strong>允许缓存 null</strong>：不设置 disableCachingNullValues()，让 null 结果也被缓存（需处理 null 反序列化问题）</li><li><strong>@Cacheable 的 unless</strong>：不加 unless="#result==null"，这样 null 也会被缓存</li><li>但 null 缓存要设置较短 TTL</li></ul><p><strong>完整防护方案</strong>：参数校验 → 布隆过滤器 → Spring Cache → 数据库</p>',
        scenario: '将穿透防护集成到 Spring Boot 项目中，通过 AOP + 布隆过滤器 + Spring Cache 三层防护。',
        codeExample: '// 允许缓存 null 的 CacheManager 配置\n@Bean\npublic CacheManager cacheManager(RedisConnectionFactory f) {\n    RedisCacheConfiguration cfg = RedisCacheConfiguration\n        .defaultCacheConfig()\n        .entryTtl(Duration.ofMinutes(30))\n        .serializeValuesWith(SerializationPair\n            .fromSerializer(\n                new GenericJackson2JsonRedisSerializer()));\n    // 注意：不调用 .disableCachingNullValues()\n    // 允许 null 被缓存，防止穿透\n\n    return RedisCacheManager.builder(f)\n        .cacheDefaults(cfg).build();\n}\n\n// 结合布隆过滤器的 Service\n@Service\npublic class ProductService {\n    private final RBloomFilter<Long> bloomFilter;\n\n    @PostConstruct\n    public void initBloom() {\n        RBloomFilter<Long> bf = redisson\n            .getBloomFilter("product:ids");\n        bf.tryInit(1000000, 0.01);\n        productRepo.findAllIds().forEach(bf::add);\n        this.bloomFilter = bf;\n    }\n\n    public Product getProduct(Long id) {\n        // 第一层：参数校验\n        if (id == null || id <= 0) return null;\n        // 第二层：布隆过滤器\n        if (!bloomFilter.contains(id)) return null;\n        // 第三层：Spring Cache\n        return findByIdCached(id);\n    }\n\n    @Cacheable(value = "products", key = "#id")\n    public Product findByIdCached(Long id) {\n        return productRepo.findById(id).orElse(null);\n    }\n}',
        estimatedMinutes: 25,
        tags: ['缓存问题', '实用']
      }
    ]
  }
];

// ============================================================
// Phase 10 — 工程化能力
// ============================================================
export const phase10Topics = [
  { id: 'maven', title: 'Maven', description: '掌握 Java 项目构建工具 Maven 的核心概念', estimatedHours: 3, knowledgePoints: [
    { id: 'maven-pom', title: 'pom.xml 结构', shortDesc: 'pom.xml 是项目的"户口本"——记录项目坐标、依赖、构建配置等所有信息', deepPrinciple: '<p><strong>POM（Project Object Model）</strong>是 Maven 核心配置。核心元素：</p><ul><li><strong>GAV 坐标</strong>：groupId + artifactId + version，全球唯一标识</li><li><strong>dependencies</strong>：依赖列表</li><li><strong>build/plugins</strong>：构建插件</li><li><strong>parent</strong>：父 POM 继承（Spring Boot 项目继承 spring-boot-starter-parent）</li><li><strong>properties</strong>：统一管理版本号</li></ul>', scenario: '创建 Spring Boot 项目，pom.xml 声明所需的 starter 依赖。', codeExample: '<project>\n    <parent>\n        <groupId>org.springframework.boot</groupId>\n        <artifactId>spring-boot-starter-parent</artifactId>\n        <version>3.2.0</version>\n    </parent>\n    <groupId>com.example</groupId>\n    <artifactId>my-shop</artifactId>\n    <version>1.0.0</version>\n\n    <properties>\n        <java.version>17</java.version>\n    </properties>\n\n    <dependencies>\n        <dependency>\n            <groupId>org.springframework.boot</groupId>\n            <artifactId>spring-boot-starter-web</artifactId>\n        </dependency>\n        <dependency>\n            <groupId>org.springframework.boot</groupId>\n            <artifactId>spring-boot-starter-test</artifactId>\n            <scope>test</scope>\n        </dependency>\n    </dependencies>\n</project>', estimatedMinutes: 25, tags: ['构建工具', '必学'] },
    { id: 'maven-dependency-scope', title: '依赖管理与 scope', shortDesc: 'scope 决定依赖在哪个阶段生效——compile 全程参与，test 只测试用，provided 不打包', deepPrinciple: '<p><strong>scope 类型</strong>：</p><ul><li><strong>compile</strong>（默认）：编译+测试+运行都可用</li><li><strong>test</strong>：仅测试阶段（JUnit、Mockito）</li><li><strong>provided</strong>：编译可用但不打包（Servlet API）</li><li><strong>runtime</strong>：运行时可用（MySQL 驱动）</li></ul><p><strong>依赖传递</strong>：A→B→C，A 间接依赖 C。用 exclusions 排除。<strong>dependencyManagement</strong> 在父 POM 统一版本。</p>', scenario: '两个库都依赖不同版本 Jackson，用 dependencyManagement 统一。', codeExample: '<dependencies>\n    <dependency>\n        <groupId>org.springframework.boot</groupId>\n        <artifactId>spring-boot-starter-web</artifactId>\n    </dependency>\n    <dependency>\n        <groupId>com.mysql</groupId>\n        <artifactId>mysql-connector-j</artifactId>\n        <scope>runtime</scope>\n    </dependency>\n    <dependency>\n        <groupId>com.example</groupId>\n        <artifactId>some-lib</artifactId>\n        <exclusions>\n            <exclusion>\n                <groupId>log4j</groupId>\n                <artifactId>log4j</artifactId>\n            </exclusion>\n        </exclusions>\n    </dependency>\n</dependencies>', estimatedMinutes: 25, tags: ['构建工具', '必学'] },
    { id: 'maven-lifecycle', title: 'Maven 生命周期', shortDesc: 'Maven 生命周期像"流水线"——clean→compile→test→package→install 按顺序执行', deepPrinciple: '<p>三套独立生命周期：clean（清理）、default（compile→test→package→install→deploy）、site（文档）。执行某阶段自动执行它之前的所有阶段。</p>', scenario: 'mvn clean package -DskipTests 跳过测试打包部署。', codeExample: '# 常用命令\nmvn clean                    # 清理 target\nmvn compile                  # 编译\nmvn test                     # 测试\nmvn package                  # 打包\nmvn install                  # 安装到本地仓库\nmvn clean package -DskipTests # 跳过测试打包\nmvn dependency:tree           # 查看依赖树', estimatedMinutes: 20, tags: ['构建工具', '必学'] },
    { id: 'maven-multi-module', title: '多模块项目', shortDesc: '多模块项目像"集团公司"——父 POM 统一管理，子模块各自独立又互相依赖', deepPrinciple: '<p>大型项目拆分为多个 Maven 模块。父 POM 用 <code>modules</code> 聚合，<code>dependencyManagement</code> 统一版本。常见拆法：common、model、dao、service、web。</p>', scenario: '电商项目拆为 shop-common、shop-model、shop-service、shop-web。', codeExample: '<!-- 父 pom.xml -->\n<packaging>pom</packaging>\n<modules>\n    <module>shop-common</module>\n    <module>shop-model</module>\n    <module>shop-service</module>\n    <module>shop-web</module>\n</modules>\n\n<dependencyManagement>\n    <dependencies>\n        <dependency>\n            <groupId>com.example</groupId>\n            <artifactId>shop-common</artifactId>\n            <version>${project.version}</version>\n        </dependency>\n    </dependencies>\n</dependencyManagement>', estimatedMinutes: 25, tags: ['构建工具', '进阶'] }
  ] },
  { id: 'gradle-intro', title: 'Gradle 入门', description: '了解 Gradle 构建工具基本使用', estimatedHours: 1, knowledgePoints: [
    { id: 'gradle-basics', title: 'build.gradle 与 Groovy DSL', shortDesc: 'Gradle 用脚本代替 XML——更简洁灵活，构建更快', deepPrinciple: '<p>Gradle 使用 Groovy/Kotlin DSL 定义构建。核心概念：Project、Task、Plugin、Dependency。Gradle Wrapper（gradlew）项目自带版本。</p>', scenario: 'Spring Initializr 支持 Maven 或 Gradle。', codeExample: 'plugins {\n    id \'java\'\n    id \'org.springframework.boot\' version \'3.2.0\'\n    id \'io.spring.dependency-management\' version \'1.1.4\'\n}\ngroup = \'com.example\'\nversion = \'1.0.0\'\njava.sourceCompatibility = JavaVersion.VERSION_17\n\ndependencies {\n    implementation \'org.springframework.boot:spring-boot-starter-web\'\n    runtimeOnly \'com.mysql:mysql-connector-j\'\n    testImplementation \'org.springframework.boot:spring-boot-starter-test\'\n}', estimatedMinutes: 20, tags: ['构建工具', '了解'] },
    { id: 'gradle-vs-maven', title: 'Gradle vs Maven 对比', shortDesc: 'Maven 像"模板房"规范统一，Gradle 像"自建房"灵活高效', deepPrinciple: '<p><strong>Gradle</strong>：增量编译、构建缓存、并行执行，大项目快 2-10 倍。<strong>Maven</strong>：约定大于配置，学习成本低，企业更广泛。</p>', scenario: '新项目可用 Gradle；企业遗留多 Maven；Android 必须 Gradle。', codeExample: '// Maven 5 行 vs Gradle 1 行\nimplementation \'org.springframework.boot:spring-boot-starter-web\'\n\n// 常用命令\n// ./gradlew build      # 编译+测试+打包\n// ./gradlew bootRun    # 运行 Spring Boot\n// ./gradlew test       # 运行测试\n// ./gradlew dependencies  # 依赖树', estimatedMinutes: 15, tags: ['构建工具', '了解'] }
  ] },
  { id: 'junit5', title: 'JUnit 5 单元测试', description: '掌握 JUnit 5 编写高质量单元测试', estimatedHours: 3, knowledgePoints: [
    { id: 'junit5-basics', title: '@Test 与断言', shortDesc: '@Test 标记测试方法，断言是"判官"——assertEquals 判相等，assertThrows 判异常', deepPrinciple: '<p>JUnit 5 核心：@Test 标记测试。常用断言：assertEquals、assertNotNull、assertTrue、assertThrows、assertAll（分组断言）。</p>', scenario: '测试工具类和 Service 业务逻辑。', codeExample: 'import static org.junit.jupiter.api.Assertions.*;\n\nclass CalculatorTest {\n    @Test\n    void shouldAddTwoNumbers() {\n        assertEquals(5, new Calculator().add(2, 3));\n    }\n\n    @Test\n    void shouldThrowWhenDivideByZero() {\n        assertThrows(ArithmeticException.class,\n            () -> new Calculator().divide(1, 0));\n    }\n\n    @Test\n    void shouldValidateUser() {\n        User user = new User("张三", 28);\n        assertAll("user",\n            () -> assertNotNull(user.getName()),\n            () -> assertTrue(user.getAge() > 0)\n        );\n    }\n}', estimatedMinutes: 25, tags: ['测试', '必学'] },
    { id: 'junit5-lifecycle', title: '@BeforeEach/@AfterEach 生命周期', shortDesc: '@BeforeEach 是"考前准备"每个测试前执行，@AfterEach 是"考后收卷"每个测试后执行', deepPrinciple: '<p>@BeforeAll（类级初始化）、@BeforeEach（每个测试前）、@AfterEach（每个测试后）、@AfterAll（类级清理）。@DisplayName 自定义名称，@Disabled 跳过。</p>', scenario: '每个测试前初始化数据，测试后清理。', codeExample: '@DisplayName("用户服务测试")\nclass UserServiceTest {\n    private UserService userService;\n\n    @BeforeEach\n    void setUp() {\n        userService = new UserService(new MockUserRepo());\n    }\n\n    @Test\n    @DisplayName("根据 ID 查询用户")\n    void shouldReturnUserWhenIdExists() {\n        User user = userService.findById(1L);\n        assertNotNull(user);\n        assertEquals("张三", user.getName());\n    }\n\n    @Test\n    @DisplayName("查不到用户抛异常")\n    void shouldThrowWhenNotFound() {\n        assertThrows(BusinessException.class,\n            () -> userService.findById(999L));\n    }\n}', estimatedMinutes: 20, tags: ['测试', '必学'] },
    { id: 'mockito-basics', title: 'Mockito 基础', shortDesc: 'Mockito 创建"替身演员"——模拟外部依赖的行为，让单元测试只关注被测代码', deepPrinciple: '<p>Mockito 用于 Mock 外部依赖：@Mock 创建 Mock、@InjectMocks 注入、when().thenReturn() 定义行为、verify() 验证调用。</p>', scenario: 'Mock UserRepository 避免真正操作数据库。', codeExample: '@ExtendWith(MockitoExtension.class)\nclass UserServiceTest {\n    @Mock private UserRepository userRepo;\n    @InjectMocks private UserService userService;\n\n    @Test\n    void shouldReturnUserWhenExists() {\n        User mockUser = new User(1L, "张三");\n        when(userRepo.findById(1L))\n            .thenReturn(Optional.of(mockUser));\n\n        User result = userService.findById(1L);\n        assertEquals("张三", result.getName());\n        verify(userRepo).findById(1L);\n    }\n\n    @Test\n    void shouldThrowWhenNotExists() {\n        when(userRepo.findById(999L))\n            .thenReturn(Optional.empty());\n        assertThrows(BusinessException.class,\n            () -> userService.findById(999L));\n    }\n}', estimatedMinutes: 30, tags: ['测试', '必学'] }
  ] },
  { id: 'springboot-test', title: 'Spring Boot Test', description: '使用 Spring Boot 测试框架进行集成测试', estimatedHours: 2, knowledgePoints: [
    { id: 'springboot-test-annotation', title: '@SpringBootTest 集成测试', shortDesc: '@SpringBootTest 启动完整 Spring 容器进行测试——真实 Bean、真实配置', deepPrinciple: '<p>@SpringBootTest 启动完整容器适合集成测试。@MockBean 在容器中注入 Mock。TestRestTemplate 发真实 HTTP 请求。</p>', scenario: '测试完整 API 流程：HTTP→Controller→Service→Repository。', codeExample: '@SpringBootTest(webEnvironment =\n    SpringBootTest.WebEnvironment.RANDOM_PORT)\nclass UserApiTest {\n    @Autowired private TestRestTemplate rest;\n    @MockBean private UserService userService;\n\n    @Test\n    void shouldReturnUser() {\n        when(userService.findById(1L))\n            .thenReturn(new UserVO(1L, "张三"));\n        ResponseEntity<Result> resp = rest\n            .getForEntity("/api/v1/users/1", Result.class);\n        assertEquals(200, resp.getStatusCode().value());\n    }\n}', estimatedMinutes: 25, tags: ['测试', '必学'] },
    { id: 'web-mvc-test', title: '@WebMvcTest 与 @MockBean', shortDesc: '@WebMvcTest 只测 Controller 层——不启动完整容器，速度快', deepPrinciple: '<p>@WebMvcTest 只加载指定 Controller 和 Web 配置，配合 MockMvc 模拟请求。比 @SpringBootTest 快很多。</p>', scenario: '快速测试请求映射、参数校验、响应格式。', codeExample: '@WebMvcTest(UserController.class)\nclass UserControllerTest {\n    @Autowired private MockMvc mockMvc;\n    @MockBean private UserService userService;\n\n    @Test\n    void shouldReturnUserList() throws Exception {\n        when(userService.findAll())\n            .thenReturn(List.of(new UserVO(1L, "张三")));\n        mockMvc.perform(get("/api/v1/users"))\n            .andExpect(status().isOk())\n            .andExpect(jsonPath("$.code").value(200))\n            .andExpect(jsonPath("$.data[0].name").value("张三"));\n    }\n}', estimatedMinutes: 25, tags: ['测试', '必学'] }
  ] },
  { id: 'logging', title: '日志 SLF4J + Logback', description: '掌握 Java 项目日志配置', estimatedHours: 2, knowledgePoints: [
    { id: 'log-levels', title: '日志级别', shortDesc: '日志级别像"信息等级"——TRACE 最琐碎，ERROR 最严重，生产通常只看 INFO 以上', deepPrinciple: '<p>级别：TRACE &lt; DEBUG &lt; INFO &lt; WARN &lt; ERROR。SLF4J 是门面接口，Logback 是默认实现。用 @Slf4j（Lombok）或 LoggerFactory.getLogger()。</p>', scenario: '开发 DEBUG 看细节，生产 INFO 减少日志量。', codeExample: '@Slf4j\n@Service\npublic class OrderService {\n    public Order createOrder(CreateOrderDTO dto) {\n        log.debug("创建订单: {}", dto);\n        log.info("用户 {} 下单，商品 {}", dto.getUserId(), dto.getProductId());\n        try {\n            Order order = doCreate(dto);\n            log.info("订单创建成功: {}", order.getId());\n            return order;\n        } catch (Exception e) {\n            log.error("订单创建失败, userId={}", dto.getUserId(), e);\n            throw e;\n        }\n    }\n}', estimatedMinutes: 20, tags: ['日志', '必学'] },
    { id: 'logback-config', title: 'logback-spring.xml 配置', shortDesc: 'logback-spring.xml 定义日志"输出规则"——输出到哪、什么格式、保留多久', deepPrinciple: '<p>核心组件：Appender（输出目的地）、Pattern（格式）、Logger（按包设级别）、RollingPolicy（按天/大小切割）。</p>', scenario: '生产配置日志按天切割、保留 30 天、ERROR 单独文件。', codeExample: '<configuration>\n    <appender name="CONSOLE" class="...ConsoleAppender">\n        <encoder>\n            <pattern>%d{HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>\n        </encoder>\n    </appender>\n    <appender name="FILE" class="...RollingFileAppender">\n        <file>logs/app.log</file>\n        <rollingPolicy class="...TimeBasedRollingPolicy">\n            <fileNamePattern>logs/app.%d{yyyy-MM-dd}.log</fileNamePattern>\n            <maxHistory>30</maxHistory>\n        </rollingPolicy>\n        <encoder><pattern>%d %-5level %logger - %msg%n</pattern></encoder>\n    </appender>\n    <logger name="com.example" level="DEBUG"/>\n    <root level="INFO">\n        <appender-ref ref="CONSOLE"/>\n        <appender-ref ref="FILE"/>\n    </root>\n</configuration>', estimatedMinutes: 25, tags: ['日志', '必学'] },
    { id: 'mdc-async-log', title: 'MDC 追踪与异步日志', shortDesc: 'MDC 给每个请求贴"追踪标签"——搜 traceId 就能找到完整调用链', deepPrinciple: '<p><strong>MDC</strong>：在日志中添加请求级上下文（traceId、userId），基于 ThreadLocal。<strong>异步日志</strong>：AsyncAppender 队列写入，不阻塞业务线程。</p>', scenario: '微服务用 traceId 串联一次请求在所有服务的日志。', codeExample: 'public class TraceInterceptor implements HandlerInterceptor {\n    @Override\n    public boolean preHandle(HttpServletRequest req,\n            HttpServletResponse resp, Object handler) {\n        String traceId = req.getHeader("X-Trace-Id");\n        if (traceId == null)\n            traceId = UUID.randomUUID().toString().substring(0, 16);\n        MDC.put("traceId", traceId);\n        return true;\n    }\n    @Override\n    public void afterCompletion(HttpServletRequest req,\n            HttpServletResponse resp, Object handler, Exception ex) {\n        MDC.clear();\n    }\n}\n// Pattern: %d [%X{traceId}] %-5level %logger - %msg%n', estimatedMinutes: 25, tags: ['日志', '进阶'] }
  ] },
  { id: 'postman-test', title: 'Postman 测试', description: '使用 Postman 进行 API 测试', estimatedHours: 1, knowledgePoints: [
    { id: 'postman-collection', title: 'Collection 与环境变量', shortDesc: 'Collection 是"接口文件夹"归类 API，环境变量一键切换开发/测试/生产', deepPrinciple: '<p>Collection 组织 API 可导出分享。环境变量 {{baseUrl}}、{{token}} 切换环境。Pre-request Script 自动获取 token。Tests 验证响应。</p>', scenario: '开发用 localhost:8080，测试用 test-api.example.com，只需切换环境。', codeExample: '// 请求 URL: {{baseUrl}}/api/v1/users\n// Authorization: Bearer {{token}}\n\n// Pre-request Script（自动登录）\n// pm.sendRequest({url: pm.environment.get("baseUrl")+"/api/auth/login",\n//   method:"POST", body:{mode:"raw",raw:JSON.stringify({username:"admin",password:"123"})}},\n//   (err,res) => pm.environment.set("token", res.json().data.token));\n\n// Tests\n// pm.test("code 200", () => pm.expect(pm.response.json().code).to.eql(200));', estimatedMinutes: 20, tags: ['工具', '必学'] },
    { id: 'postman-runner', title: '自动化测试 Runner', shortDesc: 'Runner 像"自动测试机"——批量运行所有请求并验证结果', deepPrinciple: '<p>Collection Runner 批量运行所有请求执行 Tests 脚本。支持 CSV 数据驱动参数化测试。Newman CLI 集成到 CI/CD。</p>', scenario: '提交代码前用 Runner 跑一遍所有 API 测试。', codeExample: '// Newman CLI\n// npm install -g newman\n// newman run collection.json -e dev-env.json\n// newman run collection.json -d data.csv\n\n// CI/CD 集成\n// newman run postman/collection.json \\\n//   -e postman/test-env.json \\\n//   --reporters cli,junit', estimatedMinutes: 20, tags: ['工具', '实用'] }
  ] },
  { id: 'git-collaboration', title: 'Git 协作', description: '掌握团队 Git 协作流程', estimatedHours: 2, knowledgePoints: [
    { id: 'git-branch-strategy', title: '分支策略（GitFlow/Trunk-Based）', shortDesc: 'GitFlow 像"多车道"各功能走自己的道，Trunk-Based 像"单车道"大家都走主干', deepPrinciple: '<p><strong>GitFlow</strong>：main、develop、feature/*、release/*、hotfix/*。适合版本发布周期长。<strong>Trunk-Based</strong>：所有人向 main 提交（短分支+PR），配合 Feature Flag，适合持续部署。</p>', scenario: '5 人团队用 GitFlow：从 develop 建 feature 分支，完成后 PR 合并。', codeExample: '# GitFlow\ngit checkout develop\ngit checkout -b feature/user-login\n# ... 开发 ...\ngit add . && git commit -m "feat(auth): 添加登录功能"\ngit push origin feature/user-login\n# GitHub 创建 PR → Review → 合并 develop\n\n# 发布\ngit checkout -b release/1.0.0 develop\ngit checkout main && git merge release/1.0.0\ngit tag v1.0.0', estimatedMinutes: 25, tags: ['Git', '必学'] },
    { id: 'code-review-pr', title: 'Code Review 与 PR 流程', shortDesc: 'PR 是"提交审核"——代码不直接合并，让同事检查后才能合入主分支', deepPrinciple: '<p>流程：建分支→提交代码→创建 PR→Review→修改→Approve→合并。Review 关注：逻辑正确性、安全漏洞、代码风格、测试覆盖。.gitignore 排除 target/、.idea/、.env。</p>', scenario: 'Review 发现 SQL 注入漏洞和未加索引的慢查询。', codeExample: '# .gitignore\ntarget/\n*.class\n*.jar\n.idea/\n*.iml\n.env\napplication-local.yml\nlogs/\n*.log\nnode_modules/', estimatedMinutes: 20, tags: ['Git', '必学'] }
  ] },
  { id: 'docker-basics', title: 'Docker 基础', description: '掌握 Docker 容器化与 Spring Boot 部署', estimatedHours: 3, knowledgePoints: [
    { id: 'docker-concept', title: '镜像与容器概念', shortDesc: '镜像是"安装光盘"，容器是"运行中的程序"——一个镜像可启动多个容器', deepPrinciple: '<p><strong>镜像（Image）</strong>：只读模板，分层存储。<strong>容器（Container）</strong>：镜像的运行实例，隔离进程，启动秒级。<strong>仓库（Registry）</strong>：存储镜像。</p>', scenario: '开发环境 Mac，生产 CentOS。Docker 统一运行环境。', codeExample: 'docker pull openjdk:17-slim\ndocker images\ndocker run -d -p 8080:8080 my-app\ndocker ps\ndocker logs -f <id>\ndocker exec -it <id> /bin/bash\ndocker stop <id>\ndocker rm <id>', estimatedMinutes: 25, tags: ['Docker', '必学'] },
    { id: 'dockerfile', title: 'Dockerfile 编写', shortDesc: 'Dockerfile 是"建房图纸"——一步步描述如何把应用打包成 Docker 镜像', deepPrinciple: '<p>指令：FROM（基础镜像）、COPY（复制文件）、RUN（执行命令）、EXPOSE（声明端口）、ENTRYPOINT（启动命令）。多阶段构建让最终镜像更小。</p>', scenario: 'Spring Boot 应用打包为 Docker 镜像。', codeExample: '# 多阶段构建\nFROM maven:3.9-eclipse-temurin-17 AS build\nWORKDIR /app\nCOPY pom.xml .\nRUN mvn dependency:go-offline\nCOPY src ./src\nRUN mvn package -DskipTests\n\nFROM eclipse-temurin:17-jre-alpine\nWORKDIR /app\nCOPY --from=build /app/target/*.jar app.jar\nEXPOSE 8080\nENTRYPOINT ["java", "-jar", "app.jar"]\n\n# docker build -t my-shop:1.0 .\n# docker run -d -p 8080:8080 -e SPRING_PROFILES_ACTIVE=prod my-shop:1.0', estimatedMinutes: 25, tags: ['Docker', '必学'] },
    { id: 'docker-compose', title: 'docker-compose 编排与 Spring Boot 容器化', shortDesc: 'docker-compose 像"全家桶"——一条命令同时启动应用、数据库、Redis', deepPrinciple: '<p>docker-compose 用 YAML 定义多容器应用。<code>docker-compose up -d</code> 一键启动。容器间通过服务名互访。</p>', scenario: '本地一键启动 Spring Boot + MySQL + Redis。', codeExample: 'version: "3.8"\nservices:\n  app:\n    build: .\n    ports: ["8080:8080"]\n    environment:\n      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/shop\n      SPRING_REDIS_HOST: redis\n    depends_on: [mysql, redis]\n  mysql:\n    image: mysql:8.0\n    ports: ["3306:3306"]\n    environment:\n      MYSQL_ROOT_PASSWORD: "123456"\n      MYSQL_DATABASE: shop\n    volumes: [mysql-data:/var/lib/mysql]\n  redis:\n    image: redis:7-alpine\n    ports: ["6379:6379"]\nvolumes:\n  mysql-data:\n\n# docker-compose up -d\n# docker-compose down\n# docker-compose logs -f app', estimatedMinutes: 25, tags: ['Docker', '必学'] }
  ] }
];

// ============================================================
// Phase 11 — AI 全栈衔接
// ============================================================
export const phase11Topics = [
  { id: 'http-call-ai-api', title: 'HTTP 调用 AI API', description: '用 Java 后端调用大模型 API', estimatedHours: 3, knowledgePoints: [
    { id: 'resttemplate-openai', title: 'RestTemplate 调用 OpenAI Chat API', shortDesc: 'RestTemplate 是 Spring 的 HTTP 客户端——用它给 AI 大模型发请求', deepPrinciple: '<p>RestTemplate 是 Spring 同步 HTTP 客户端（5+ 推荐 WebClient）。调用 OpenAI 需要：构建请求体（messages）、设 Authorization 头、POST 到端点、解析响应。</p>', scenario: '后端接收用户问题，调用 OpenAI API 获取回答。', codeExample: '@Service\npublic class AiChatService {\n    @Value("${openai.api-key}") private String apiKey;\n    @Value("${openai.base-url:https://api.openai.com}") private String baseUrl;\n    private final RestTemplate restTemplate;\n\n    public AiChatService(RestTemplate rt) { this.restTemplate = rt; }\n\n    public String chat(String userMessage) {\n        HttpHeaders headers = new HttpHeaders();\n        headers.setContentType(MediaType.APPLICATION_JSON);\n        headers.setBearerAuth(apiKey);\n\n        Map<String, Object> body = Map.of(\n            "model", "gpt-3.5-turbo",\n            "messages", List.of(Map.of("role","user","content",userMessage)));\n\n        HttpEntity<Map<String,Object>> req = new HttpEntity<>(body, headers);\n        ResponseEntity<Map> resp = restTemplate.postForEntity(\n            baseUrl + "/v1/chat/completions", req, Map.class);\n\n        List<Map> choices = (List<Map>) resp.getBody().get("choices");\n        return (String) ((Map) choices.get(0).get("message")).get("content");\n    }\n}', estimatedMinutes: 30, tags: ['AI', '必学'] },
    { id: 'ai-request-build', title: '请求体构建', shortDesc: 'Chat API 请求体像"对话剧本"——system 设定角色，user 是用户的话', deepPrinciple: '<p>OpenAI 请求结构：model（模型名）、messages（role: system/user/assistant + content）、temperature（创造性 0-2）、max_tokens（最大长度）、stream（流式）。</p>', scenario: '客服机器人：system 设定"你是电商客服"，user 是问题。', codeExample: 'public class ChatRequest {\n    private String model = "gpt-3.5-turbo";\n    private List<Message> messages;\n    private Double temperature = 0.7;\n    private Integer maxTokens = 1000;\n\n    public static class Message {\n        private String role;\n        private String content;\n    }\n}\n\n// 多轮对话\nList<ChatRequest.Message> msgs = new ArrayList<>();\nmsgs.add(new Message("system", "你是电商客服"));\nmsgs.add(new Message("user", "订单什么时候发货？"));\nmsgs.add(new Message("assistant", "请提供订单号"));\nmsgs.add(new Message("user", "20240101001"));', estimatedMinutes: 25, tags: ['AI', '必学'] },
    { id: 'ai-response-parse', title: '响应解析', shortDesc: 'AI 返回的 JSON 像"俄罗斯套娃"——层层解开拿到实际回答', deepPrinciple: '<p>响应结构：choices[0].message.content 是回答。usage 包含 token 统计（计费用）。finish_reason 表示结束原因。推荐定义类型化 DTO。</p>', scenario: '解析回复并记录 token 用量计费。', codeExample: 'public class ChatResponse {\n    private List<Choice> choices;\n    private Usage usage;\n\n    public static class Choice {\n        private Message message;\n        private String finishReason;\n    }\n    public static class Usage {\n        private int promptTokens;\n        private int completionTokens;\n        private int totalTokens;\n    }\n}\n\nChatResponse resp = restTemplate.postForObject(url, req, ChatResponse.class);\nString answer = resp.getChoices().get(0).getMessage().getContent();\nlog.info("消耗 {} tokens", resp.getUsage().getTotalTokens());', estimatedMinutes: 20, tags: ['AI', '必学'] }
  ] },
  { id: 'json-processing', title: 'JSON 处理', description: '掌握 Jackson 库 JSON 序列化与反序列化', estimatedHours: 2, knowledgePoints: [
    { id: 'jackson-objectmapper', title: 'Jackson ObjectMapper 序列化与反序列化', shortDesc: 'ObjectMapper 是 Java 对象和 JSON 之间的"翻译官"', deepPrinciple: '<p>writeValueAsString（序列化）、readValue（反序列化）。注解：@JsonProperty（字段映射）、@JsonIgnore（忽略）、@JsonFormat（日期）。泛型用 TypeReference。</p>', scenario: 'Redis 缓存需要序列化为 JSON。', codeExample: 'ObjectMapper mapper = new ObjectMapper();\nmapper.registerModule(new JavaTimeModule());\n\n// 序列化\nString json = mapper.writeValueAsString(user);\n// 反序列化\nUser parsed = mapper.readValue(json, User.class);\n// 泛型\nList<User> users = mapper.readValue(listJson,\n    new TypeReference<List<User>>() {});\n\npublic class UserDTO {\n    @JsonProperty("user_name") private String userName;\n    @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate birthday;\n    @JsonIgnore private String password;\n}', estimatedMinutes: 30, tags: ['JSON', '必学'] },
    { id: 'jackson-generic', title: '@JsonProperty 与泛型处理', shortDesc: '@JsonProperty 处理"字段名不一致"——Java 驼峰 vs JSON 下划线', deepPrinciple: '<p>PropertyNamingStrategies.SNAKE_CASE 全局转下划线。JsonNode 树模型处理动态 JSON。</p>', scenario: '对接第三方下划线风格 API。', codeExample: '// 全局转下划线\nmapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);\n\n// 树模型\nJsonNode root = mapper.readTree(json);\nString name = root.path("data").path("user").path("name").asText();\nfor (JsonNode item : root.path("data").path("items")) {\n    System.out.println(item.path("title").asText());\n}', estimatedMinutes: 20, tags: ['JSON', '必学'] }
  ] },
  { id: 'sse-streaming', title: 'SSE 流式响应', description: '实现 AI 对话的逐 token 流式输出', estimatedHours: 3, knowledgePoints: [
    { id: 'sse-protocol', title: 'text/event-stream 协议', shortDesc: 'SSE 是"直播频道"——服务器持续向客户端推送数据', deepPrinciple: '<p>SSE 是 HTTP 单向推送。响应头 Content-Type: text/event-stream。格式：<code>data: {...}\\n\\n</code>。结束：<code>data: [DONE]\\n\\n</code>。比 WebSocket 简单，AI 场景足够。</p>', scenario: 'AI 聊天界面逐字显示（打字机效果）。', codeExample: '// SSE 数据格式\n// Content-Type: text/event-stream\n// Cache-Control: no-cache\n//\n// data: {"choices":[{"delta":{"content":"你"}}]}\n//\n// data: {"choices":[{"delta":{"content":"好"}}]}\n//\n// data: [DONE]', estimatedMinutes: 20, tags: ['AI', '必学'] },
    { id: 'sse-token-push', title: '逐 token 推送与 SseEmitter', shortDesc: 'SseEmitter 是 Spring 的"直播推送器"——收到 AI 每个字就立刻推给前端', deepPrinciple: '<p>SseEmitter 创建长连接，send() 持续推送，complete() 结束。流式调用 AI：stream=true → WebClient 读流 → 逐行解析 → SseEmitter 转发。</p>', scenario: '后端调 AI 流式接口，逐 token 推送给前端。', codeExample: '@GetMapping(value = "/api/ai/stream",\n    produces = MediaType.TEXT_EVENT_STREAM_VALUE)\npublic SseEmitter streamChat(@RequestParam String msg) {\n    SseEmitter emitter = new SseEmitter(60000L);\n    CompletableFuture.runAsync(() -> {\n        try {\n            // 模拟逐 token 推送\n            for (String token : List.of("你","好","！")) {\n                emitter.send(SseEmitter.event()\n                    .data(Map.of("content", token)));\n                Thread.sleep(100);\n            }\n            emitter.send(SseEmitter.event().data("[DONE]"));\n            emitter.complete();\n        } catch (Exception e) {\n            emitter.completeWithError(e);\n        }\n    });\n    return emitter;\n}', estimatedMinutes: 30, tags: ['AI', '必学'] },
    { id: 'sse-frontend', title: '前端 EventSource 接收', shortDesc: 'EventSource 是浏览器内置"SSE 接收器"——自动监听服务器推送', deepPrinciple: '<p>EventSource 是浏览器原生 API，自动处理 SSE。只支持 GET，POST 需用 fetch + ReadableStream。</p>', scenario: '前端聊天界面监听 SSE，收到 token 追加到对话框。', codeExample: '// EventSource（GET）\nconst source = new EventSource("/api/ai/stream?msg=" + encodeURIComponent("你好"));\nsource.onmessage = (event) => {\n    const data = JSON.parse(event.data);\n    if (data === "[DONE]") { source.close(); return; }\n    document.getElementById("answer").innerText += data.content;\n};\nsource.onerror = () => source.close();\n\n// fetch + ReadableStream（POST）\nasync function streamChat(message) {\n    const resp = await fetch("/api/ai/stream", {\n        method: "POST",\n        headers: {"Content-Type": "application/json"},\n        body: JSON.stringify({message})\n    });\n    const reader = resp.body.getReader();\n    const decoder = new TextDecoder();\n    while (true) {\n        const {done, value} = await reader.read();\n        if (done) break;\n        console.log(decoder.decode(value));\n    }\n}', estimatedMinutes: 25, tags: ['AI', '必学'] }
  ] },
  { id: 'api-key-management', title: 'API 密钥管理', description: '安全管理 AI API 密钥等敏感配置', estimatedHours: 1, knowledgePoints: [
    { id: 'value-injection', title: '@Value 环境变量注入', shortDesc: '@Value 把配置文件的值"注射"到 Java 字段——代码不硬编码任何配置', deepPrinciple: '<p>@Value("${key}") 从 yml 或环境变量注入。支持默认值 ${key:default}。@ConfigurationProperties 映射为对象更适合多属性。</p>', scenario: 'API Key 配置在 yml 或环境变量中。', codeExample: '// application.yml\n// openai:\n//   api-key: ${OPENAI_API_KEY}\n//   base-url: https://api.openai.com\n\n@Value("${openai.api-key}") private String apiKey;\n@Value("${openai.base-url:https://api.openai.com}") private String baseUrl;\n\n// @ConfigurationProperties 方式\n@ConfigurationProperties(prefix = "openai")\npublic class OpenAiProperties {\n    private String apiKey;\n    private String baseUrl = "https://api.openai.com";\n}', estimatedMinutes: 20, tags: ['安全', '必学'] },
    { id: 'sensitive-config', title: 'Jasypt 加密敏感配置', shortDesc: 'Jasypt 给密码"加密码锁"——配置文件泄露密码也看不到', deepPrinciple: '<p>敏感配置原则：严禁硬编码、用环境变量占位符、Jasypt 加密（ENC() 包裹）、.env 不提交 Git。</p>', scenario: '数据库密码和 API Key 加密存储在配置文件中。', codeExample: '// application.yml\n// spring.datasource.password: ENC(加密后的字符串)\n// openai.api-key: ENC(加密后的字符串)\n// jasypt.encryptor.password: ${JASYPT_PASSWORD}\n\n// 运行时传入解密密钥\n// java -jar app.jar --jasypt.encryptor.password=mySecretKey\n// 或: export JASYPT_PASSWORD=mySecretKey && java -jar app.jar', estimatedMinutes: 20, tags: ['安全', '必学'] }
  ] },
  { id: 'python-quickstart', title: 'Python 快速入门', description: '作为 Java 开发者快速上手 Python', estimatedHours: 2, knowledgePoints: [
    { id: 'python-vs-java', title: 'Python vs Java 语法对比', shortDesc: 'Python 像"便签纸"简洁随意，Java 像"正式文件"严谨规范', deepPrinciple: '<p>核心差异：缩进代替大括号、动态类型不声明、无分号、def 定义函数。AI 领域 Python 生态最强。</p>', scenario: 'AI 领域 Python 是主流，Java 后端需掌握基础。', codeExample: '# Java: String name = "张三";\nname = "张三"\n\n# Java: List<Integer> list = List.of(1,2,3);\nnums = [1, 2, 3]\n\n# Java: Map<String,Integer>\nmap = {"a": 1, "b": 2}\n\ndef add(a, b):\n    return a + b\n\nfor i in range(10):\n    print(i)\n\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError as e:\n    print(f"错误: {e}")\n\nclass User:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age', estimatedMinutes: 30, tags: ['Python', '必学'] },
    { id: 'pip-venv', title: 'pip 包管理与 venv 虚拟环境', shortDesc: 'pip 是 Python 的"Maven"，venv 是"隔离房间"每个项目独立依赖', deepPrinciple: '<p>pip install 安装包，requirements.txt 管理依赖。venv 虚拟环境隔离不同项目依赖。</p>', scenario: '项目 A 和 B 用不同版本 openai，venv 隔离。', codeExample: '# 创建虚拟环境\npython -m venv .venv\n# 激活\n.venv\\Scripts\\activate  # Windows\nsource .venv/bin/activate  # Mac/Linux\n\npip install openai langchain\npip freeze > requirements.txt\npip install -r requirements.txt\ndeactivate', estimatedMinutes: 20, tags: ['Python', '必学'] },
    { id: 'python-syntax-sugar', title: 'Python 核心语法速通', shortDesc: '列表推导式、f-string——Python 独有的高效语法糖', deepPrinciple: '<p>列表推导式、f-string 格式化、解包、with 自动资源管理、lambda 匿名函数、类型提示。</p>', scenario: '用 Python 写 AI 脚本和数据处理。', codeExample: '# 列表推导式\nsquares = [x**2 for x in range(10) if x % 2 == 0]\n\n# f-string\nprint(f"姓名: {name}, 年龄: {age}")\n\n# with（自动关闭）\nwith open("data.txt") as f:\n    content = f.read()\n\n# lambda\nnums.sort(key=lambda x: -x)\n\n# 类型提示\ndef greet(name: str, age: int) -> str:\n    return f"Hello {name}"', estimatedMinutes: 25, tags: ['Python', '必学'] }
  ] },
  { id: 'python-llm', title: 'Python 调用 LLM', description: '使用 Python 生态调用大语言模型', estimatedHours: 2, knowledgePoints: [
    { id: 'openai-python-sdk', title: 'openai Python SDK', shortDesc: 'Python 调 OpenAI 只需 3 行代码——比 Java 简洁得多', deepPrinciple: '<p>openai Python SDK 是官方库，API 简洁，支持同步/异步/流式/函数调用。</p>', scenario: '快速编写 AI 脚本、原型验证。', codeExample: 'from openai import OpenAI\nimport os\n\nclient = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))\n\nresponse = client.chat.completions.create(\n    model="gpt-3.5-turbo",\n    messages=[{"role":"user","content":"解释 IoC"}]\n)\nprint(response.choices[0].message.content)\n\n# 流式\nstream = client.chat.completions.create(\n    model="gpt-3.5-turbo",\n    messages=[{"role":"user","content":"写首诗"}],\n    stream=True\n)\nfor chunk in stream:\n    if chunk.choices[0].delta.content:\n        print(chunk.choices[0].delta.content, end="")', estimatedMinutes: 25, tags: ['AI', '必学'] },
    { id: 'langchain-concept', title: 'LangChain 概念', shortDesc: 'LangChain 是搭建 AI 应用的"乐高积木"——把提示词、模型、工具拼在一起', deepPrinciple: '<p>LangChain 核心：Model（对接 LLM）、Prompt Template（提示词模板）、Chain（串联步骤）、Memory（对话记忆）、RAG（检索增强生成）。</p>', scenario: '构建能查知识库的 AI 客服。', codeExample: 'from langchain_openai import ChatOpenAI\nfrom langchain.prompts import ChatPromptTemplate\nfrom langchain.schema import StrOutputParser\n\nllm = ChatOpenAI(model="gpt-3.5-turbo")\nprompt = ChatPromptTemplate.from_messages([\n    ("system", "你是 {role}"),\n    ("user", "{question}")\n])\nchain = prompt | llm | StrOutputParser()\n\nanswer = chain.invoke({"role": "Java 专家",\n    "question": "Spring Boot 自动配置原理"})\nprint(answer)', estimatedMinutes: 25, tags: ['AI', '推荐'] },
    { id: 'simple-chatbot', title: '简单对话机器人', shortDesc: '十几行代码写一个带记忆的 AI 聊天机器人', deepPrinciple: '<p>多轮对话关键是维护消息历史，每次调用带上之前的对话。注意 token 限制需截断历史。</p>', scenario: '命令行 AI 聊天机器人，支持多轮对话。', codeExample: 'from openai import OpenAI\nclient = OpenAI()\n\nmessages = [{"role":"system","content":"你是友好的 AI 助手"}]\nwhile True:\n    user_input = input("\\n你: ")\n    if user_input == "quit": break\n\n    messages.append({"role":"user","content":user_input})\n    resp = client.chat.completions.create(\n        model="gpt-3.5-turbo", messages=messages)\n    reply = resp.choices[0].message.content\n    messages.append({"role":"assistant","content":reply})\n    print(f"AI: {reply}")\n\n    if len(messages) > 41:\n        messages = [messages[0]] + messages[-40:]', estimatedMinutes: 25, tags: ['AI', '实战'] }
  ] },
  { id: 'fullstack-roadmap', title: '全栈技能路线图', description: '展望全栈开发者需要掌握的技能栈', estimatedHours: 1, knowledgePoints: [
    { id: 'nodejs-role', title: 'Node.js 角色（API 网关/BFF）', shortDesc: 'Node.js 是前后端之间的"翻译官"——BFF 层为前端定制接口', deepPrinciple: '<p>Node.js 角色：BFF（为不同前端聚合微服务数据）、API 网关（路由/认证/限流）、SSR（Next.js/Nuxt.js）、工具链（Webpack/Vite）。</p>', scenario: 'Java 微服务提供原子 API，Node.js BFF 聚合数据。', codeExample: '// Node.js BFF 示例\napp.get("/api/bff/dashboard/:id", async (req, res) => {\n    const uid = req.params.id;\n    const [user, orders, notifs] = await Promise.all([\n        axios.get(`http://user-service/api/users/${uid}`),\n        axios.get(`http://order-service/api/users/${uid}/orders`),\n        axios.get(`http://notify-service/api/users/${uid}/unread`)\n    ]);\n    res.json({ user: user.data, orders: orders.data,\n               unread: notifs.data.count });\n});', estimatedMinutes: 20, tags: ['全栈', '了解'] },
    { id: 'devops-overview', title: '运维（Docker/K8s/CI/CD）', shortDesc: 'CI/CD 是"自动化流水线"——代码提交后自动测试、构建、部署', deepPrinciple: '<p>核心技能：Docker（容器化）、Kubernetes（编排/扩缩容）、CI/CD（GitHub Actions/Jenkins）、监控（Prometheus + Grafana）。</p>', scenario: 'git push 后 Actions 自动测试→构建镜像→部署到 K8s。', codeExample: '# .github/workflows/deploy.yml\nname: Deploy\non: { push: { branches: [main] } }\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-java@v4\n        with: { java-version: 17, distribution: temurin }\n      - run: mvn clean package\n      - run: docker build -t my-app:${{ github.sha }} .\n      - run: docker push registry/my-app:latest\n      - run: kubectl rollout restart deployment/my-app', estimatedMinutes: 20, tags: ['全栈', '了解'] },
    { id: 'testing-overview', title: '测试体系（自动化/性能）', shortDesc: '测试金字塔——单元测试打基础、集成测试保流程、E2E 测试验收效果', deepPrinciple: '<p>底层：单元测试（JUnit+Mockito，最多）。中层：集成测试（@SpringBootTest）。上层：E2E（Playwright/Selenium，最少）。性能测试：JMeter/Gatling。</p>', scenario: '上线前确保单元覆盖率>80%，核心流程有集成测试，关键页面有 E2E。', codeExample: '// 1. 单元测试（毫秒级）\nassertEquals(80.0, calc.discount(100, 0.2));\n\n// 2. 集成测试（秒级）\n@SpringBootTest\nvoid shouldCreateOrder() { /* Controller→Service→DB */ }\n\n// 3. E2E 测试（分钟级，Playwright）\n// await page.goto("/login");\n// await page.fill("#username", "admin");\n// await page.click("#submit");\n// await expect(page).toHaveURL("/dashboard");\n\n// 4. 性能测试：1000 并发持续 5 分钟\n// 关注：P99 延迟、错误率、吞吐量', estimatedMinutes: 20, tags: ['全栈', '了解'] }
  ] },
  { id: 'first-ai-app', title: '你的第一个 AI 应用', description: 'Spring Boot + AI API 整合实战', estimatedHours: 3, knowledgePoints: [
    { id: 'ai-app-architecture', title: 'Spring Boot + AI API 整合架构', shortDesc: '整合架构像"三明治"——前端 Vue 是面包，Spring Boot 是肉，AI API 是酱料', deepPrinciple: '<p>架构：前端（Vue 聊天界面 + SSE）→ 后端（Spring Boot 构建 Prompt → 调用 AI API → 流式返回）→ AI API（OpenAI/Claude）。扩展：Redis 缓存对话、MySQL 存用户数据、向量库做 RAG。</p>', scenario: '构建 Java 学习助手：用户提问，AI 回答，支持流式和对话历史。', codeExample: '// 项目结构\n// ├── config/OpenAiConfig.java\n// ├── controller/ChatController.java\n// ├── service/ChatService.java\n// ├── model/ChatRequest.java, ChatResponse.java\n// └── AiApplication.java\n\n// application.yml\n// openai:\n//   api-key: ${OPENAI_API_KEY}\n//   base-url: https://api.openai.com\n//   model: gpt-3.5-turbo', estimatedMinutes: 30, tags: ['AI', '实战'] },
    { id: 'ai-app-complete-example', title: '完整示例代码', shortDesc: '从零到一的完整 AI 聊天应用——复制即可运行', deepPrinciple: '<p>完整实现：Controller（REST + SSE 接口）、Service（管理对话历史 Redis）、WebClient（调 AI 流式接口）、全局异常处理、环境变量管理。</p>', scenario: '完整可运行的 AI 聊天后端。', codeExample: '@RestController\n@RequestMapping("/api/chat")\npublic class ChatController {\n    private final ChatService chatService;\n    public ChatController(ChatService cs) { this.chatService = cs; }\n\n    @PostMapping\n    public Result<String> chat(@RequestBody ChatRequest req) {\n        return Result.success(chatService.chat(req.getSessionId(), req.getMessage()));\n    }\n\n    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)\n    public SseEmitter stream(@RequestBody ChatRequest req) {\n        return chatService.streamChat(req.getSessionId(), req.getMessage());\n    }\n}\n\n@Service\npublic class ChatService {\n    @Value("${openai.api-key}") private String apiKey;\n    @Value("${openai.base-url}") private String baseUrl;\n    private final StringRedisTemplate redis;\n    private final WebClient webClient = WebClient.builder().build();\n\n    public ChatService(StringRedisTemplate r) { this.redis = r; }\n\n    public String chat(String sessionId, String message) {\n        List<Map<String,String>> history = getHistory(sessionId);\n        history.add(Map.of("role","user","content",message));\n        Map<String,Object> body = Map.of("model","gpt-3.5-turbo","messages",history);\n        Map resp = webClient.post().uri(baseUrl+"/v1/chat/completions")\n            .header("Authorization","Bearer "+apiKey)\n            .bodyValue(body).retrieve().bodyToMono(Map.class).block();\n        String reply = extractReply(resp);\n        history.add(Map.of("role","assistant","content",reply));\n        saveHistory(sessionId, history);\n        return reply;\n    }\n}', estimatedMinutes: 40, tags: ['AI', '实战'] }
  ] }
];