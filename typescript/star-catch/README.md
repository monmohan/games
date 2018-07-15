"module": "commonjs",
        
Other option in tsconfig.json is "files": ["StarCatchGame.ts","./node_modules/phaser-ce/typescript/phaser.d.ts"]
"paths": {
            "*": ["*","node_modules/phaser-ce/typescript"] // This mapping is relative to "baseUrl"
        }
     
     "files": ["StarCatchGame.ts","./node_modules/phaser-ce/typescript/phaser.d.ts"]

     