# todo-calendar

### master branch

달력 기능을 구현한 브랜치입니다. 

### separate-data-frame

master branch 이후로 리팩토링 한 브랜치입니다.

[ 데이터로 달력을 조작하는 부분과 엘리먼트를 만드는 부분 분리 ]

현재(master branch) 달력 프레임과 데이터가 함께 만들어지고 있습니다. (makeThisMonth() 함수 내부)
table로 달력을 개발하였는데, 데이터(date 정보)를 입히면서 동시에 element( tr 태그, td 태그 등)를 생성하고 있습니다. 

관리하기 힘든 코드라고 생각되어 달력 틀(table)을 만드는 부분과 데이터를 입력하는 부분을 분리시키는 것을 생각해보았습니다. 

### changeMonth

separate-data-frame 이후 개발한 브랜치입니다.

[ 이전, 다음 달로 이동 시 달력 프레임 재사용 ]

현재(master branch) 달을 변경하면 기존의 tbody를 삭제하고 새로 tbody, tr, td 를 만들고 있습니다.
하지만 달을 변경해도 전체적인 틀은 재사용할 수 있다고 생각했습니다. 
달력 프레임을 재사용하고 데이터만 바꿀 수 있다면 달이 변경 될 때마다 element가 삭제되고 생성되는 부하를 줄일 수 있지 않을까라고 생각하였고 작업을 진행했습니다.