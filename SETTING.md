
## yarn 버전 업그레이드

### 1. react root 폴더로 이동 
   ### `$ cd ./frontend`
### 2. yarn berry 버전으로 설정 (이미 yarn 이 설치되어있다는 가정하에)
   ### `$ yarn set version berry`
### 3. node_module 폴더 삭제
### 4. .yarnrc.yml 파일 확인
   nodeLinker가  node-modules 폴더로 설정되어있으면 해당 라인 제거
### 5. 의존성 업데이트
   ### `$yarn install`
