console.log('JS - Github Search User')

;(() => {
  document.addEventListener('DOMContentLoaded', init)


  function init() {
    const $themeToggle = document.querySelector('.js-theme-toggle')
    const $btnSearch = document.querySelectorAll('.js-github-btn')
    const $inputSearch = document.querySelectorAll('.js-github-input')

    searchUser()

    $themeToggle.addEventListener('click', themeToggle)

    $btnSearch.forEach($target => {
      $target.addEventListener('click', searchUser)
    })

    $inputSearch.forEach($target => {
      $target.addEventListener('keydown', () => {

        if (event.key === 'Enter') {
          searchUser()
        }
      })
    })
  }


  function themeToggle() {
    $html = document.querySelector('html')
    $btnText = event.currentTarget.querySelector('.js-theme-toggle-text')

    $html.classList.toggle('dark')

    $html.classList.contains('dark')
      ? $btnText.innerText = 'Light'
      : $btnText.innerText = 'Dark'
  }


  function searchUser() {
    const $github = document.querySelector('.js-github')
    const $input = document.querySelector('.js-github-input')

    if (! $github || ! $input) {
      return
    }

    const user = $input.value

    if (! user) {
      return errorMessage()
    }

    userFetch(user)


    // functions
    function userFetch(user) {
      const url = `https://api.github.com/users/${user}`
      const param = { method: 'GET' }

      fetch(url, param)
        .then(response => statusCheck(response))
        .then(response => response.json())
        .then(json => {
          userData(json)
        })
        .catch(response => {
          console.log('The query could not be performed:\n', response)

          errorMessage()
        })
    }

    function statusCheck(response) {

      if (response.ok) {
        return response
      }
      else {
        return Promise.reject('ERROR: statusCheck()')
      }
    }

    function userData(data) {
      const $image = $github.querySelector('.js-github-image')
      const $name = $github.querySelector('.js-github-name')
      const $username = $github.querySelector('.js-github-username')
      const $bio = $github.querySelector('.js-github-bio')
      const $joined = $github.querySelector('.js-github-joined')
      const $followers = $github.querySelector('.js-github-followers')
      const $following = $github.querySelector('.js-github-following')
      const $repos = $github.querySelector('.js-github-repos')
      const $location = $github.querySelector('.js-github-location')
      const $site = $github.querySelector('.js-github-site')
      const $x = $github.querySelector('.js-github-x')
      const $company = $github.querySelector('.js-github-company')

      setDataImage($image, data.avatar_url)
      setData($name, data.name)
      setData($username, data.login)
      setData($bio, data.bio, 'bio')
      setData($joined, convertDate(data.created_at))

      setData($followers, data.followers)
      setData($following, data.following)
      setData($repos, data.public_repos)

      setData($location, data.location, 'location')
      setData($site, data.site_admin, 'site')
      setData($x, data.twitter_username, 'twitter')
      setData($company, data.company, 'company')
    }

    function setDataImage($target, data) {

      if (! data) {
        return
      }

      $target.src = data
    }

    function setData($target, data, type) {

      if (! type) {
        type = ''
      }

      if (! data) {
        data = `${type} not available`
      }

      $target.innerText = data
    }

    function convertDate(data) {
      const dateObj = new Date(data)
      const day = dateObj.getDate()
      const mounth = dateObj.toLocaleString('default', { month: 'short' })
      const year = dateObj.getFullYear()
      const joinDate = `${day} ${mounth} ${year}`

      return joinDate
    }

    function errorMessage() {
      const $error = document.querySelector('.js-github-error')

      $error.dataset.animation = 'true'
      setTimeout(() => $error.dataset.animation = 'false', 5000)
    }
  }
})()