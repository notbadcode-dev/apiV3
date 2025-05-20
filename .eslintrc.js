module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // Convenciones de nombres
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'class',
        format: ['PascalCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase'],
      },
      {
        selector: 'variable',
        modifiers: ['const'],
        format: ['UPPER_CASE'],
      },
      {
        selector: 'property',
        format: ['camelCase'],
      },
      {
        selector: 'method',
        format: ['camelCase'],
      },
      {
        selector: 'function',
        format: ['camelCase'],
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
            "regex": "^I[A-Z]",
            "match": true
        }
    },
    {
        "selector": "enum",
        "format": ["PascalCase"],
        "custom": {
            "regex": "^E[A-Z]",
            "match": true
        }
    },
    {
        "selector": "typeAlias",
        "format": ["PascalCase"],
        "custom": {
            "regex": "^T[A-Z]",
            "match": true
        }
    },
      {
        selector: 'parameter',
        format: ['camelCase'],
      },
      {
        selector: 'import',
        format: ['camelCase'],
      },
      {
        selector: 'method',
        format: ['camelCase'],
      },
    ],

    // TypeScript rules
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',

    // General formatting rules
    'max-len': ['error', { 'code': 180 }],

    // Import rules
    'import/order': [
      'error',
      {
        groups: [
          // 1. Agrupamos los imports de módulos incorporados (como `fs`, `path`) y bibliotecas externas
          ['builtin', 'external'],
          
          // 2. Agrupamos los módulos internos, que son los que provienen de tu propio proyecto (por ejemplo, `@nestjs/*`)
          'internal',
          
          // 3. Los módulos hermanos y padres
          ['sibling', 'parent'],
          
          // 4. Finalmente, los imports de los índices (por ejemplo, `index.ts`)
          'index',
        ],
        // Asegura que haya una línea en blanco entre los diferentes grupos de imports
        'newlines-between': 'always',  // Esto asegura que haya siempre una línea en blanco entre los grupos
        alphabetize: {
          order: 'asc', // Ordenar los imports alfabéticamente dentro de cada grupo
          caseInsensitive: true,  // No diferencia entre mayúsculas y minúsculas
        },
      },
    ],

    // Prettier integration
    'prettier/prettier': 'error',

    // Magic numbers and magic strings
    '@typescript-eslint/no-magic-numbers': [
      'error',
      {
        ignore: [0],  // Puedes permitir estos números si los necesitas en tu código (opcional)
        ignoreArrayIndexes: true,  // Permitir índices en arreglos
      },
    ],

    // Mejorar la calidad del código
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',

    // Nueva regla: No permitir aserciones non-null
    '@typescript-eslint/no-non-null-assertion': 'error',

    // Nueva regla: Prevenir expresiones no utilizadas
    '@typescript-eslint/no-unused-expressions': 'error',

    // Nueva regla: Prohibir comentarios de @ts-ignore
    '@typescript-eslint/ban-ts-comment': 'error',

    // Nueva regla: No permitir el uso de console.log
    'no-console': ['error', { allow: ['info', 'error'] }],

    // Nueva regla: Evitar tipos inferribles
    '@typescript-eslint/no-inferrable-types': 'error',

    // Nueva regla: Usar tipos consistentes (interface/type)
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

    // Nueva regla: Ordenar miembros de clases
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          'public-static-field',
          'protected-static-field',
          'private-static-field',
          'public-instance-field',
          'protected-instance-field',
          'private-instance-field',
          'constructor',
          'public-method',
          'protected-method',
          'private-method',
        ],
      },
    ],

    // Nueva regla: Preferir el encadenamiento opcional
    '@typescript-eslint/prefer-optional-chain': 'error',

    // Nueva regla: Uso coherente de tipos de array
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],

    // Nueva regla: Especificar la accesibilidad de los miembros de la clase
    '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],

    // Nueva regla: Promesas sin manejar
    '@typescript-eslint/no-floating-promises': 'error',

    // Nueva regla: Verificación de exhaustividad en switch
    '@typescript-eslint/switch-exhaustiveness-check': 'error',

    // Nuevas reglas agregadas
    '@typescript-eslint/explicit-function-return-type': 'error', // Asegura que todas las funciones tengan un tipo de retorno explícito
    '@typescript-eslint/no-unsafe-assignment': 'error', // Prevenir asignaciones de valores no seguros

    // Nueva regla: Prefiere el uso de funciones de flecha en lugar de funciones tradicionales como callbacks
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],

    // Regla para eliminar los imports no utilizados
    'import/no-unused-modules': [ 'error', { unusedExports: true } ],
    
  },
  overrides: [
    {
      files: ['*.constants.ts', '*.enum.ts'],
      rules: {
        '@typescript-eslint/no-magic-numbers': 'off',
        'no-unused-vars': 'off',
      },
    },
    {
      files: ['*service-test.data*'],
      rules: {
        '@typescript-eslint/no-magic-numbers': 'off',
      },
    },
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          { 
            accessibility: 'explicit', 
            overrides: { 
              constructors: 'off' 
            } 
          },
        ]
      }
    }
  ],
};
