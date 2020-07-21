const $txtExpresion = document.querySelector("#txtExpresion")

const listadoGramatica = [
  { Exp: 'BA;' },
  { A: '*BA|e'},
  { B: 'numC' },
  { C: '+numC|e' }
]

const jsonGramatica = {
  "Exp": {
    "B": {
      "num": {},
      "C": {
        "+": {},
        "num": {},
        "C": {
          "e": {}
        }
      }
    },
    "A": {
      "*": {},
      "B": {
        "num": {},
        "C": {
          "+": {},
          "num": {},
          "C": {
              "e": {}
          }
        }
      },
      "A": {
        "e": {}
      }
    },
    ";": {}
  }
}

const regexGramatica = RegExp('[a-z]+|[A-Z]|[-+*/();]', 'g');
const regexMatematica = RegExp('[0-9]+|[-+*/();]', 'g');

window.addEventListener('load', () => {
  const ramas = construirRamas()
  const arbol = construirArbol(ramas)

  render(listadoGramatica)

  document.querySelector("#txtArbol").innerHTML = JSON.stringify(jsonGramatica, undefined, 4)
  // document.querySelector("#txtArbol").innerHTML = JSON.stringify(arbol, undefined, 4)
})

$txtExpresion.addEventListener('input', e => {
  evaluarExpresion(e.target.value)
})

document.querySelector("#btnMostrarArbol").addEventListener('click', e => {
  console.log(evaluarExpresion($txtExpresion.value))
  if (evaluarExpresion($txtExpresion.value)) {
    $('#modalGramatica').modal('show')
  } else {
    $('#modalError').modal('show')
  }
})

$('#modalGramatica').on('shown.bs.modal', function (e) {
  draw()
})

const construirRamas = () => {
  let ramas = {}
  listadoGramatica.forEach((item) => {
    Object.entries(item).forEach(([key, value]) => {
      const orValue = value.split('|')
      ramas[key] = []
      orValue.forEach((orValueItem, orValueIndex) => {
        ramas[key].push([])
        while ((result = regexGramatica.exec(orValueItem)) !== null) {
          ramas[key][orValueIndex].push(result[0])
        }
      })
    })
  })
  console.log(ramas);
  return ramas
}

const construirArbol = (params) => {
  const ramas = params
  let arbol = {}
  Object.entries(params).forEach(([key, values], index) => {
    arbol[key] = {}
    values.forEach((orValues, orValuesIndex) => {
      orValues.forEach(item => {
        if (orValuesIndex == 0) {
          arbol[key][item] = {}
        }
        if (item == key) {
          arbol[key][item][ramas[key][orValuesIndex+1]] = {}
        }
      })
    })
  })
  console.log(arbol)
  return arbol
}

const construirExpresion = (params) => {
  let expresiones = []
  while ((result = regexMatematica.exec(params)) !== null) {
    expresiones.push({ expresion: result[0], gramatica: (isNaN(Number(result[0]))) ? result[0] : 'num' })
  }
  console.log(expresiones)
  return expresiones
}

const render = (list) => {
  $tbody = document.getElementById("tbodyTokens")
  $badge = document.getElementById("spanMaximo")

  $tbody.innerHTML = ''
  $badge.innerHTML = list.length

  list.forEach((element, index) => {
    const tr = (`
      <tr>
        <td>${index+1}</td>
        <td>${Object.keys(element)} <span>&#8594;</span> ${Object.values(element)}</td>
      </tr>
    `)

    $tbody.innerHTML += tr
  });

  return;
}

const evaluarExpresion = (value) => {
  const expresionMatematica = construirExpresion(value)
  const divOK = document.querySelector("#divOK")

  const noAccept = "invalid-feedback"
  
  let valid = false

  if (expresionMatematica.length == 7) {
    const validExpresiones = {
      num1: (Object.keys(jsonGramatica.Exp.B)[0] == expresionMatematica[0].gramatica) ? true : false,
      plus1: (Object.keys(jsonGramatica.Exp.B.C)[0] == expresionMatematica[1].gramatica) ? true : false,
      num2: (Object.keys(jsonGramatica.Exp.B.C)[1] == expresionMatematica[2].gramatica) ? true : false,
      asterisk1: (Object.keys(jsonGramatica.Exp.A)[0] == expresionMatematica[3].gramatica) ? true : false,
      num3: (Object.keys(jsonGramatica.Exp.A.B)[0] == expresionMatematica[4].gramatica) ? true : false,
      plus2: (Object.keys(jsonGramatica.Exp.A.B.C)[0] == expresionMatematica[5].gramatica) ? true : false,
      num4: (Object.keys(jsonGramatica.Exp.A.B.C)[1] == expresionMatematica[6].gramatica) ? true : false,
    }

    valid = true
    Object.values(validExpresiones).forEach(item => {
      if (!item) valid = item
    })

    if (valid) {
      console.log("si entra")
      divOK.innerHTML = "Expresión aceptada"
      if (divOK.classList.contains(noAccept)) divOK.classList.remove(noAccept)
    } else {
      divOK.innerHTML = "Expresión no aceptada"
      if (!divOK.classList.contains(noAccept)) divOK.classList.add(noAccept)
    }
    // console.log(validExpresiones, valid, 2+3*4+5)
  } else {
    divOK.innerHTML = "Expresión no aceptada"
    if (!divOK.classList.contains(noAccept)) divOK.classList.add(noAccept)
  }
  return valid
}

const draw = () => {
  const expresion = document.querySelector("#txtExpresion")
  const expresionMatematica = construirExpresion(expresion.value)
  
  var nodes = [
      {id: 0, label: Object.keys(jsonGramatica)[0], group: 0},
      {id: 1, label: 'Árbol', group: 40},
      {id: 3, label: Object.keys(jsonGramatica.Exp.B)[0], group: 1},
      {id: 4, label: Object.keys(jsonGramatica.Exp)[0], group: 1},
      {id: 5, label: expresionMatematica[0].expresion, group: 1},
      {id: 6, label: Object.keys(jsonGramatica.Exp.A)[0], group: 2},
      {id: 7, label: Object.keys(jsonGramatica.Exp)[1], group: 2},
      {id: 8, label: Object.keys(jsonGramatica.Exp.A)[1], group: 2},
      {id: 9, label: Object.keys(jsonGramatica.Exp.B.C)[0], group: 3},
      {id: 10, label: Object.keys(jsonGramatica.Exp.B)[1], group: 3},
      {id: 11, label: Object.keys(jsonGramatica.Exp.B.C)[1], group: 3},
      {id: 12, label: expresionMatematica[2].expresion, group: 3},
      {id: 13, label: Object.keys(jsonGramatica.Exp)[2], group: 4},
      {id: 15, label: Object.keys(jsonGramatica.Exp.B.C)[2], group: 5},
      {id: 16, label: Object.keys(jsonGramatica.Exp.B.C.C)[0], group: 5},
      {id: 17, label: Object.keys(jsonGramatica.Exp.A.B)[0], group: 6},
      {id: 18, label: Object.keys(jsonGramatica.Exp.A.B)[1], group: 6},
      {id: 19, label: Object.keys(jsonGramatica.Exp.A.B.C)[0], group: 7},
      {id: 20, label: Object.keys(jsonGramatica.Exp.A.B.C)[1], group: 7},
      {id: 21, label: Object.keys(jsonGramatica.Exp.A.B.C)[2], group: 7},
      {id: 22, label: Object.keys(jsonGramatica.Exp.A.B.C.C)[0], group: 9},
      {id: 24, label: Object.keys(jsonGramatica.Exp.A.A)[0], group: 8},
      {id: 25, label: Object.keys(jsonGramatica.Exp.A)[2], group: 8},
      {id: 26, label: expresionMatematica[4].expresion, group: 6},
      {id: 27, label: expresionMatematica[6].expresion, group: 7},
  ];
  var edges = [
      {from: 1, to: 0},
      {from: 4, to: 3},
      {from: 5, to: 3},
      {from: 4, to: 0},
      {from: 7, to: 6},
      {from: 8, to: 7},
      {from: 7, to: 0},
      {from: 10, to: 9},
      {from: 11, to: 10},
      {from: 12, to: 11},
      {from: 10, to: 4},
      {from: 13, to: 0},
      {from: 16, to: 15},
      {from: 15, to: 10},
      {from: 25, to: 24},
      {from: 25, to: 7},
      {from: 17, to: 8},
      {from: 18, to: 8},
      {from: 19, to: 18},
      {from: 20, to: 18},
      {from: 21, to: 18},
      {from: 22, to: 21},
      {from: 26, to: 17},
      {from: 27, to: 20},
  ]

  // create a network
  var container = document.getElementById('divArbol');
  var data = {
      nodes: nodes,
      edges: edges
  };
  var options = {
    layout: {
        hierarchical: {
            direction: "UD"
        }
    },
    nodes: {
        shape: 'dot',
        size: 30,
        font: {
            size: 32,
            color: '#ffffff'
        },
        borderWidth: 2
    },
    edges: {
      width: 2
    },
  };
  network = new vis.Network(container, data, options);
}